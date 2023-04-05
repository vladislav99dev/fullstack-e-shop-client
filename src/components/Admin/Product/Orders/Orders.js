import React, { useState, useEffect, useReducer } from "react";
import ordersRequester from "../../../../services/ordersRequester";
import { useAuthContext } from "../../../../context/AuthContext";
import isAdmin from "../../../../HOC/adminRoutesGuard";
import modalMessages from "../../../../HOC/modalMessages";
import { useModalsContext } from "../../../../context/ModalsContext";
import Order from "./Order";
import Spinner from "../../../Spinner/Spinner";
import styles from "./Orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuthContext();
  const { setFailedModal } = useModalsContext();
  const [isLoading,setIsLoading] = useState(true);
  // const [currImage, setCurrImage] = useState();

  useEffect(() => {
    ordersRequester
      .getAllOrders({ profileId: user._id }, user.accessToken)
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((response) => {
        setOrders(response)
        setIsLoading(false)
      });
  }, []);

  const updateOrderHandler = async (orderId,orderStatus) => {
    setIsLoading(true)
    try{
      const response = await ordersRequester.updateOrder({orderStatus,profileId:user._id},user.accessToken,orderId);
      const jsonResponse = await response.json();
      if(response.status === 200)  {
        console.log(orders);
        setOrders(jsonResponse.formatedOrders);
        console.log(orders);
        setTimeout(()=>{
          setIsLoading(false);
        },2000)
        
      };
    }catch(err){
      console.log(err);
    }
  };

  return (
    <>
    {isLoading ? <Spinner/> : (
      <div className={styles.container}>
      <div className={`${styles["orders-container"]}`}>
      {orders?.map((order) => {
        return (
          <Order
          key={order.orderInfo.orderId}
          data={order}
          updateOrderHandler={updateOrderHandler}
            />
            );
          })}
          </div>
          </div>
           )} 
          </>
  );
};

export default isAdmin(modalMessages(Orders));
