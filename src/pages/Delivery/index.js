/**
 * src/pages/Delivery/index.js
 */

import '@azure/core-asynciterator-polyfill';
import * as Location from "expo-location";
import { useRef, useEffect, useState, useContext } from "react";
import { View, useWindowDimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from '../../contexts/AuthContext';
import { OrderContext } from '../../contexts/OrderContext';
import { DataStore } from "@aws-amplify/datastore";
import { Courier, OrderStatus } from "../../models";

import styles from "./styles";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../../components/CustomMarker";

/*
importante incluir e inserir a chave GOOGLE_API_KEY a partir do arquivo .env (enviroment keys), removida do repositório por motivos
de segurança
*/

export default function OrderDeliveryScreen() {
  const { order, user, fetchOrder } = useContext(OrderContext);
  const { dbCourier } = useContext(AuthContext);
  const [ driverLocation, setDriverLocation ] = useState(null);
  const [ totalMinutes, setTotalMinutes ] = useState(0);
  const [ totalKm, setTotalKm ] = useState(0);

  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  useEffect(() => {
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    if (!driverLocation) {
      return;
    }
    DataStore.save(
      Courier.copyOf(dbCourier, (updated) => {
        updated.Latitude = driverLocation.latitude;
        updated.Longitude = driverLocation.longitude;
      })
    );
  }, [driverLocation]);

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

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 500,
      },
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, []);

  function zoomInOnDriver() {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const restaurantLocation = {
    latitude: order?.Delivery?.Latitude,
    longitude: order?.Delivery?.Longitude,
  };

  const deliveryLocation = {
    latitude: user?.Latitude,
    longitude: user?.Longitude,
  };

  if (!order || !user || !driverLocation) {
    return(
      <View style={{ flex: 1, justifyContent: "center", alignItens: "center"}}>
        <ActivityIndicator size={"large"} color="#000" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{ width, height }}
        showsUserLocation
        followsUserLocation
        initialRegion = {{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        <MapViewDirections
          origin = {driverLocation}
          destination = {
            order.Status === OrderStatus.PREPARANDO ? restaurantLocation : deliveryLocation
          }
          strokeWidth = {10}
          waypoints = {
            order.Status === OrderStatus.PRONTO_PARA_RETIRADA ? [restaurantLocation] : []
          }
          strokeColor = "#3FC060"
          apikey = {"GOOGLE_API_KEY"}
          onReady = {(result) => {
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <CustomMarker data = {order?.Delivery} type="DELIVERY" />
        <CustomMarker data = {user} type="USUÁRIO" />
      </MapView>
      <BottomSheetDetails
        totalKm={totalKm}
        totalMinutes={totalMinutes}
        onAccepted={zoomInOnDriver}
      />
      {order.Status === OrderStatus.PRONTO_PARA_RETIRADA && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="black"
          style={{ top: 40, left: 15, position: "absolute" }}
        />
      )}
    </View>
  );
};
