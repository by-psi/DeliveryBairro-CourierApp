/**
* src/context/BottomSheetDetails.js
*/

import '@azure/core-asynciterator-polyfill';
import { useRef, useMemo, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { OrderContext } from "../../contexts/OrderContext";
import { OrderStatus } from '../../models';
import { useNavigation } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import styles from "./styles";

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: "Accept Order",
  ACCEPTED: "Pick-Up Order",
  PICKED_UP: "Complete Delivery",
};

export default function BottomSheetDetails(props) {
  const { totalKm, totalMinutes, onAccepted } = props;
  const { order, user, dishes, acceptOrder, completeOrder, pickUpOrder } = useContext(OrderContext);
  const isDriverClose = totalKm <= 1; // decrease for higher accuracy

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();

  async function onButtonPressed() {
    const { Status } = order;
    if (Status === OrderStatus.PRONTO_PARA_RETIRADA) {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
    } else if (Status === OrderStatus.AGUARDANDO) {
      bottomSheetRef.current?.collapse();
      await pickUpOrder();
    } else if (Status === OrderStatus.SAIU_PARA_ENTREGA) {
      await completeOrder();
      bottomSheetRef.current?.collapse();
      navigation.goBack();
    }
  };

  function isButtonDisabled() {
    const { Status } = order;
    if (Status === OrderStatus.PRONTO_PARA_RETIRADA) {
      return false;
    }
    if ((Status === OrderStatus.AGUARDANDO || Status === OrderStatus.SAIU_PARA_ENTREGA) && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
    <BottomSheet
      ref = { bottomSheetRef }
      snapPoints = { snapPoints }
      handleIndicatorStyle = { styles.handleIndicator }
    >
      <View style={styles.handleIndicatorContainer}>
        <Text style={styles.routeDetailsText}>
          { totalMinutes.toFixed(0) } minutos
        </Text>
        <FontAwesome5
          name = "shopping-bag"
          size = {30}
          color = "#3FC060"
          style = {{ marginHorizontal: 10 }}
        />
        <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
      </View>
      <View style={styles.deliveryDetailsContainer}>
        <Text style={styles.restaurantName}>{order.Delivery.Nome}</Text>
        <View style={styles.adressContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.adressText}>{order.Delivery.Endereco}</Text>
        </View>

        <View style={styles.adressContainer}>
          <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
          <Text style={styles.adressText}>{user?.Endereco}</Text>
        </View>

        <View style={styles.orderDetailsContainer}>
          {dishes?.map((dishItem) => (
            <Text style={styles.orderItemText} key={dishItem.id}>
              {dishItem.Dish.Nome} x{dishItem.Qtd}
            </Text>
          ))}
        </View>
      </View>
      <Pressable
        style={{
          ...styles.buttonContainer,
          backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
        }}
        onPress={onButtonPressed}
        disabled={isButtonDisabled()}
      >
        <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.Status]}</Text>
      </Pressable>
    </BottomSheet>
  );
};
