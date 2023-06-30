/**
* src/context/OrderContext.js
*/

import '@azure/core-asynciterator-polyfill';
import { useState, useEffect, useContext, createContext } from "react";
import { AuthContext } from "./AuthContext";
import { DataStore } from "@aws-amplify/datastore";
import { User, Order, OrderDish, OrderStatus } from "../models";

export const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useContext(AuthContext);
  const [ order, setOrder ] = useState();
  const [ user, setUser ] = useState();
  const [ dishes, setDishes ] = useState();

  async function fetchOrder(id) {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);
    DataStore.query(User, fetchedOrder.userID).then(setUser);
    DataStore.query(OrderDish, (od) => od?.orderID.eq(fetchedOrder.id)).then(setDishes);
  };

  useEffect(() => {
    if (!order) {
      return;
    }
    const subscription = DataStore.observe(Order, order?.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          fetchOrder(element?.id);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [order?.id]);

  async function acceptOrder() {
    // update the order, and change status, and assign the courier
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.Status = OrderStatus.AGUARDANDO;
        updated.courierID = dbCourier?.id;
      })
    );
    setOrder(updatedOrder);
  };

  async function pickUpOrder() {
    // update the order, and change status, and assign the courier
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.Status = OrderStatus.PRONTO_PARA_RETIRADA;
      })
    );
    setOrder(updatedOrder);
  };

  async function completeOrder() {
    // update the order, and change status, and assign the courier
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.Status = OrderStatus.FINALIZADO;
      })
    );
    setOrder(updatedOrder);
  };

  return (
    <OrderContext.Provider value={{ user, order, dishes, acceptOrder, fetchOrder, pickUpOrder, completeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

// NOVO
// AGUARDANDO
// PREPARANDO
// PRONTO_PARA_RETIRADA
// SAIU_PARA_ENTREGA
// RECEBIDO
// FINALIZADO
// CANCELADO
