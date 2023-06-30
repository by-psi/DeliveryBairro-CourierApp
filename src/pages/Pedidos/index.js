/**
 * src/pages/Pedidos/index.js
 */

import '@azure/core-asynciterator-polyfill';
import { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, useWindowDimensions, ActivityIndicator, StyleSheet } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { Order, OrderStatus } from "../../models";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import PageHeader from '../../components/PageHeader';
import OrderItem from "../../components/OrderItem";
import MapView from "react-native-maps";
import CustomMarker from "../../components/CustomMarker";

import * as Location from "expo-location";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [driverLocation, setDriverLocation] = useState([]);

  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  async function fetchOrders() {
    // DataStore.query(Order).then(setOrders);
    await DataStore.query(Order, (order) => order.Status.eq(OrderStatus.PRONTO_PARA_RETIRADA)).then(setOrders);
  };

  useEffect(() => {
    fetchOrders();
    const subscription = DataStore.observe(Order).subscribe((msg) => {
      if (msg.opType === "UPDATE") {
        fetchOrders();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (!status === "granted") {
      console.log("Nonono");
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    setDriverLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  useEffect(() => {
    getLocation();
  }, []);

  if (!driverLocation) {
    return(
      <View style={{ flex: 1, justifyContent: "center", alignItens: "center"}}>
        <ActivityIndicator size={"large"} color="#000" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <PageHeader/>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        {orders.map((order) => (
          <CustomMarker
            key={order.id}
            id={order.deliveryID}
            type="DELIVERY"
          />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={styles.bottom}>
          <Text style={styles.title}>Você está online!</Text>
          <Text style={styles.subtitle}>Pedidos disponíveis para retirada: {orders.length}</Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue", 
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingBottom: 5,
  },
  subtitle:{
    letterSpacing: 0.5, 
    color: "grey"
  },
  bottom:{ 
    alignItems: "center", 
    marginBottom: 30 
  }
})

