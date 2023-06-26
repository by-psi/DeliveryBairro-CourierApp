import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from "react-native";

import Pedidos from "../pages/Pedidos";
import OrderDelivery from "../pages/Delivery";
import Perfil from "../pages/Perfil";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { dbCourier, loading } = useAuthContext();

  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen 
            name="OrdersScreen" 
            component={ Pedidos } 
          />
          <Stack.Screen
            name="OrdersDeliveryScreen"
            component={ OrderDelivery }
          />
        </>
      ) : (
        <Stack.Screen 
          name="ProfileScreen" 
          component={ Perfil } 
        />
      )}
    </Stack.Navigator>
  );
};
