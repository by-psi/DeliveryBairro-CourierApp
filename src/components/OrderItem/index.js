/**
 * src/components/OrderItem/index.js
 */

import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
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
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrdersDeliveryScreen', {id: order?.id})}>
      <Image source={{ uri: delivery?.UrlFoto }} style={styles.imagem} />
      <View style={styles.card}>
        <Text style={styles.title}>{delivery?.Nome}</Text>
        <Text style={{ color: "grey" }}>{delivery?.Endereco}</Text>
        <Text style={{ marginTop: 10 }}>Detalhes da Entrega:</Text>
        <Text style={{ color: "grey" }}>{user?.Nome}</Text>
        <Text style={{ color: "grey" }}>{user?.Endereco}</Text>
        <Text style={{ color: "grey" }}>{user?.Telefone}</Text>
      </View>
      <View style={styles.marcador}>
        <Entypo name="check" size={30} color="white" style={{ marginLeft: "auto" }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  card: { 
    flex: 1, 
    marginLeft: 10, 
    paddingVertical: 5 
  },
  button: {
    flexDirection: "row", 
    margin: 10,
    borderColor: "#3FC060",
    borderWidth: 2,
    borderRadius: 12
  },
  imagem: {
    width: "25%", 
    height: "100%", 
    borderBottomLeftRadius: 10, 
    borderTopLeftRadius: 10
  },
  title:{ 
    fontSize: 18, 
    fontWeight: "500" 
  },
  marcador: {
    padding: 5, 
    backgroundColor: "#3FC060", 
    borderBottomRightRadius: 10, 
    borderTopRightRadius: 10, 
    alignItems: "center", 
    justifyContent: "center"
  }
});
