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

  const sub = user?.attributes?.sub;
  console.log('user sub: ', sub);

  useEffect(() => {
    async function fetchCourier() {
      const couriers = await DataStore.query(Courier, (c) => c.TokenSMS.eq(sub));
      setDbCourier(couriers[0]);
    }
    fetchCourier();
    console.log('dbCourier: ', dbCourier);
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
    <AuthContext.Provider value={{ sub, dbCourier, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
