/**
 * DeliveryBairro CourierApp - App.Routes.js
*/

import { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

import OrdersScreen from "../pages/Pedidos";
import OrderDeliveryScreen from "../pages/Delivery";
import ProfileScreen from "../pages/Perfil";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { dbCourier } = useContext(AuthContext);

  // if (loading) {
  //   return(
  //     <View style={{ flex: 1, justifyContent: "center", alignItens: "center"}}>
  //       <ActivityIndicator size={"large"} color="#FF0000" />
  //     </View>
  //   )
  // }

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
