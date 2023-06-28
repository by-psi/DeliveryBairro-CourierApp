/**
* src/components/CustomMaker.js
*/

import '@azure/core-asynciterator-polyfill';
import { useState, useEffect } from "react";
import { Marker } from "react-native-maps";
import { View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { DataStore } from "@aws-amplify/datastore";
import { Delivery } from '../../models';

export default function CustomMarker({ id, type }) {
  const [ delivery, setDelivery ] = useState({});

  useEffect(()=>{
    async function fetchDelivery() {
      await DataStore.query(Delivery, (d)=>d.id.eq(id)).then(setDelivery);
    }
    fetchDelivery();
  }, []);

  return (
    <Marker
      coordinate={{
        latitude: delivery?.Latitude,
        longitude: delivery?.Longitude,
      }}
      title={ delivery?.Nome }
      description={ delivery?.Endereco }
    >
      <View style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}>
        {type === "DELIVERY" ? (
          <Entypo name="shop" size={30} color="white" />
        ) : (
          <MaterialIcons name="restaurant" size={30} color="white" />
        )}
      </View>
    </Marker>
  );
};
