import {useState,useEffect} from "react";

import ordersRequester from "../../services/ordersRequester";

import { useModalsContext } from "../../context/ModalsContext";

import Spinner from "../Spinner/Spinner";
import AttentionModal from "../Modals/AttentionModal";
import modalMessages from "../../HOC/modalMessages";

const Orders = ({
    profileId
}) => {
    const [orders,setOrders] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const {modalState,resetModals,setFailedModal} = useModalsContext();

    useEffect(() => {
        intialRequest(profileId).then(jsonResponse => {
            setOrders(jsonResponse.orders);
            setIsLoading(false);
        }).catch(err => {
            setFailedModal("Something went wrong!",err.message,()=> {resetModals()},"Try again");
            setIsLoading(false);
        })
    },[]);

    const intialRequest = async(profileId) => {
        const response = await ordersRequester.getUserOrders(null,profileId);
        const jsonResponse = await response.json();
        if(response.status !== 200) throw {message:jsonResponse.message};
        if(response.status === 200) return jsonResponse;
    };

return(
    <>
    {isLoading ? <Spinner/> : null}
    {isLoading 
    ? <Spinner/> 
    :   <h1 className="text-[#00df9a] text-2xl italic uppercase font-bold w-full text-center">My Orders</h1>
    }

    {orders
    ? orders.map((order) => 
        <div className="w-full">
            <div className="flex justify-around mt-4">
                <h1 className="text-lg text-center">Order #{order._id}</h1>
                <h1 className="text-lg text-center">Status:{order.orderStatus}</h1>
            </div>
        </div> 
        ) 
    :  <h1>You have not made any orders yet.</h1> 
    }
    </>
)
}

export default modalMessages(Orders);