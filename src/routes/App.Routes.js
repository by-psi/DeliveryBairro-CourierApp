/**
 * DeliveryBairro CourierApp - App.Routes.js
*/

import { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from "react-native";

import OrdersScreen from "../pages/Pedidos";
import OrderDeliveryScreen from "../pages/Delivery";
import ProfileScreen from "../pages/Perfil";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { dbCourier, loading } = useContext(AuthContext);

  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen 
            name="OrdersScreen" 
            component={ OrdersScreen } 
          />
          <Stack.Screen
            name="OrdersDeliveryScreen"
            component={ OrderDeliveryScreen }
          />
        </>
      ) : (
        <Stack.Screen 
          name="ProfileScreen" 
          component={ ProfileScreen } 
        />
      )}
    </Stack.Navigator>
  );
};
