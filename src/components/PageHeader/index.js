/**
 * src/components/PageHeader/index.js
 * tabela de cores: #FFB901 #55A9D6 #7F7B7B #5D5D5D #FF0000 #0033CC #FFF000 #131313 #4DCE4D
*/

import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import logo_png from '../../../assets/logo.png';
import marca_png from '../../../assets/marca.png';
import cart_png from '../../../assets/cart.png';

export default function PageHeader() {

  return (
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={()=> {
            alert("DeliveryBairro CourierApp v1.0"+'\n'+"(31) 98410-7540");
          }}
        >
          <Image source={logo_png} style={{ width: 85, height: 85 }} resizeMode="contain" />
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={marca_png} style={{ width: 195, height: 85 }} resizeMode="contain" />
        </View>
        <Image source={cart_png} style={{ width: 85, height: 85 }} resizeMode="contain" />
      </View>
  );
}

const styles = StyleSheet.create({
  header:{
    height: 100,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: 20,
  },
})
