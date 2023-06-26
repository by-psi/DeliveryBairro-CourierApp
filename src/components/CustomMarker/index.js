import { Marker } from "react-native-maps";
import { View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

export default function CustomMarker({ data, type }) {
  return (
    <Marker
      coordinate={{
        latitude: data?.Latitude,
        longitude: data?.Longitude,
      }}
      title={ data?.Nome }
      description={ data?.Endereco }
    >
      <View style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}>
        {type === "DELIVERY" ? (
          <Entypo name="shop" size={30} color="white" />
        ) : (
          <MaterialIcons name="restaurant" size={30} color="white" />
        )}
      </View>
    </Marker>
  );
};
