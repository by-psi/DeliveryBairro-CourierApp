import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, useWindowDimensions, ActivityIndicator, SafeAreaView } from "react-native";
import { DataStore } from "aws-amplify";
import { Order } from "../../models";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import OrderItem from "../../components/OrderItem";
import MapView from "react-native-maps";
import CustomMarker from "../../components/CustomMarker";
import PageHeader from "../../components/PageHeader";

import * as Location from "expo-location";

export default function OrdersScreen() {
  const { width, height } = useWindowDimensions();
  const [ orders, setOrders ] = useState([]);
  const [ driverLocation, setDriverLocation ] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);

  function fetchOrders() {
    DataStore.query(Order, (order) =>
      order.Status("eq", "PRONTO_PARA_RETIRADA")
    ).then(setOrders);
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

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <PageHeader />
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
            data={order.Restaurant}
            type="DELIVERY"
          />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              letterSpacing: 0.5,
              paddingBottom: 5,
            }}
          >
            Você está online!
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Pedidos Disponíveis: {orders.length}
          </Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
};
