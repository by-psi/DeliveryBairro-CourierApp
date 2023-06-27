/**
 * src/contexts/AuthContext.js
 */

import '@azure/core-asynciterator-polyfill';
import { useState, useEffect, createContext } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { DataStore } from "@aws-amplify/datastore";
import { Courier } from "../models";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const { user } = useAuthenticator();
  const [ dbCourier, setDbCourier ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const sub = user?.attributes?.sub;
  console.log('user sub: ', sub);

  useEffect(() => {
    if (!sub) {
      return;
    }
    DataStore.query(Courier, (courier) => courier?.TokenSMS.eq(sub)).then(
      (couriers) => {
        setDbCourier(couriers[0]);
        setLoading(false);
        console.log('dbCourier: ', dbCourier);
      }
    );
  }, [sub]);

  useEffect(() => {
    if (!dbCourier) {
      return;
    }
    const subscription = DataStore.observe(Courier, dbCourier?.id).subscribe(
      (msg) => {
        if (msg.opType === "UPDATE") {
          setDbCourier(msg.element);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [dbCourier]);

  return (
    <AuthContext.Provider value={{ sub, dbCourier, setDbCourier, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
