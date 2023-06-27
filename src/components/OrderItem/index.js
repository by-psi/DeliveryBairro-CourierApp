import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from 'aws-amplify';
import { useNavigation } from "@react-navigation/native";
import { User, Delivery } from '../../models';

export default function OrderItem({ order }) {
  const navigation = useNavigation();
  const [ user, setUser ] = useState(null);
  const [ delivery, setDelivery ] = useState(null);

  useEffect(() => {
    DataStore.query(User, order?.userID).then(setUser);
  }, []);

  useEffect(() => {
    DataStore.query(Delivery, order?.deliveryID).then(setDelivery);
  }, [order]);

  return (
    <Pressable
      style={{
        flexDirection: "row",
        margin: 10,
        borderColor: "#3FC060",
        borderWidth: 2,
        borderRadius: 12,
      }}
      onPress={() => navigation.navigate('OrdersDeliveryScreen', {id: order?.id})}
    >
      <Image
        source={{ uri: delivery?.UrlFoto }}
        style={{
          width: "25%",
          height: "100%",
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
        }}
      />
      <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {order?.Delivery?.Nome}
        </Text>
        <Text style={{ color: "grey" }}>{delivery?.Endereco}</Text>

        <Text style={{ marginTop: 10 }}>Detalhes da Entrega:</Text>
        <Text style={{ color: "grey" }}>{user?.Nome}</Text>
        <Text style={{ color: "grey" }}>{user?.Endereco}</Text>
        <Text style={{ color: "grey" }}>{user?.Telefone}</Text>
      </View>

      <View
        style={{
          padding: 5,
          backgroundColor: "#3FC060",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Entypo
          name="check"
          size={30}
          color="white"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
