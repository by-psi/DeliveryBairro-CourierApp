/**
 * src/pages/Delivery/index.js
 */

import '@azure/core-asynciterator-polyfill';
import { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Courier, Transporte } from "../../models";
import { AuthContext } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { sub, dbCourier, setDbCourier } = useContext(AuthContext);
  const [ nome, setNome ] = useState(dbCourier?.Nome || "");
  const [ transportationMode, setTransportationMode] = useState(Transporte.BICYCLING);

  const navigation = useNavigation();

  async function onSave() {
    if (dbCourier) {
      await updateCourier();
    } else {
      await createCourier();
    }
    navigation.goBack();
  };

  async function updateCourier() {
    const courier = await DataStore.save(
      Courier.copyOf(dbCourier, (updated) => {
        updated.Nome = nome;
        updated.Transporte = transportationMode;
      })
    );
    setDbCourier(courier);
  };

  async function createCourier() {
    try {
      const courier = await DataStore.save(
        new Courier({
          "Nome": nome,
          "TokenSMS": sub,
          "Transporte": transportationMode
        })
      );
      setDbCourier(courier);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome"
        style={styles.input}
      />

      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransportationMode(Transporte.BICYCLING)}
          style={{
            backgroundColor:
              transportationMode === Transporte.BICYCLING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(Transporte.DRIVING)}
          style={{
            backgroundColor:
              transportationMode === Transporte.DRIVING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
          }}
        >
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>

      <Button onPress={onSave} title="Save" />
      <Text style={{ textAlign: "center", color: "red", margin: 10 }} onPress={() => Auth.signOut()}>
        Sign Out
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

