import {useReducer,useState} from "react"
import { useNavigate } from "react-router-dom";

import {useModalsContext} from "../../context/ModalsContext";
import * as userRequester from "../../services/userRequester"


import Input from "./Input";
import ValidationMessage from "../ValidationMessage/validationMessage";

import modalMessages from "../../HOC/modalMessages";

const reducerPasswordsState = (state,{type,payload}) => {
    switch (type) {
        case "oldPassword":
            return {
                oldPassword: payload,
                newPassword: state.newPassword,
                repeatNewPassword: state.repeatPassword,
            }
        case "newPassword":
            return {
                oldPassword: state.oldPassword,
                newPassword: payload,
                repeatNewPassword: state.repeatPassword,
            }
        case "repeatNewPassword":
            return {
                oldPassword: state.oldPassword,
                newPassword: state.newPassword,
                repeatNewPassword: payload,
            }
        case "resetPasswordState":
            return {
                oldPassword: '',
                newPassword: '',
                repeatNewPassword: '',
            }
        default:
            break;
    }
}


const ChangePassword = ({
    user,
    login
}) => {
    const navigate = useNavigate();
    const [validationMessages,setValidationMessages] = useState([]);
    const [passwordsState,dispatch] = useReducer(reducerPasswordsState,{
        oldPassword: '',
        newPassword:'',
        repeatNewPassword:''
    })
    
    const {resetModals,setSuccessModal,setFailedModal} = useModalsContext();



    const changePasswordsState = (passwordField,event) => {
        dispatch({type:passwordField,payload:event.target.value})
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        setValidationMessages([]);
        if(passwordsState.newPassword !== passwordsState.repeatNewPassword) return setValidationMessages(["New Password and Repeat Passwords does not match !"]);
        try{
            const response = await userRequester.changePassword({...passwordsState},user._id,user.accessToken);
            const jsonResponse = await response.json();
            if(response.status !== 200) throw {message:jsonResponse.message}
            if(response.status === 200) {
                login(jsonResponse.user);
                return setSuccessModal("Congrats!",jsonResponse.message,()=>{resetModals()},"Try again")
            }
        }catch(err){
            console.log(err);
            return setFailedModal("Something went wrong",err.message,()=>{resetModals()},"Try again")
        }
        
    }

    return (
        <>
        <h1 className="text-[#00df9a] text-2xl italic uppercase font-bold w-full text-center">Change Password</h1>
        { validationMessages.length 
        ? validationMessages.map((x) => <ValidationMessage key={x} message={x}/>)
        : null
        }
        <form onSubmit={submitHandler} className="mt-2">
            <Input labelName={"Enter Old Password"} changeState={changePasswordsState.bind(null,"oldPassword")} type={"password"}/>
            <Input labelName={"Enter New Password"} changeState={changePasswordsState.bind(null,"newPassword")} type={"password"}/>
            <Input labelName={"Repeat New Password"} changeState={changePasswordsState.bind(null,"repeatNewPassword")} type={"password"}/>
            <div className="flex justify-center">
                <button className="mt-4 mb-4 py-2 px-16 rounded-lg bg-[#00df9a] text-white italic font-bold text-xl hover:bg-green-300 ease-in-out duration-500" >Submit</button>
            </div>
        </form>
        </>
    )
}
export default  modalMessages(ChangePassword);