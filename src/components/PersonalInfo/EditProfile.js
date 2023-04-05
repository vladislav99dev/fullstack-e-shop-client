import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModalsContext } from "../../context/ModalsContext";

import { validateUserEdit } from "../../validations/userValidations";
import * as userRequester from "../../services/userRequester";

import Input from "./Input";
import modalMessages from "../../HOC/modalMessages";

import ValidationMessage from "../ValidationMessage/validationMessage";

const reducerFormDataState = (state, { type, payload }) => {
  if (type === "cleanup") return {};
  if (
    type !== "firstName" &&
    type !== "lastName" &&
    type !== "email" &&
    type !== "country" &&
    type !== "state" &&
    type !== "city" &&
    type !== "zipCode" &&
    type !== "country" &&
    type !== "street" &&
    type !== "unitNumber" &&
    type !== "phoneNumber"
  )
    return state;
  delete state[type];
  return {
    [type]: payload,
    ...state,
  };
};

const EditProfile = ({ user, login }) => {
  const [validationMessages, setValidationMessages] = useState([]);
  const [formDataState, dispatch] = useReducer(reducerFormDataState, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    country: user.country,
    state: user.state,
    city: user.city,
    zipCode: user.zipCode,
    street: user.street,
    unitNumber: user.unitNumber,
    phoneNumber: user.phoneNumber,
  });
  const navigate = useNavigate();
  const {setFailedModal, setSuccessModal, resetModals } =
    useModalsContext();

  const changeFormDataState = (type, event) => {
    if (type === "cleanup") return {};
    dispatch({ type: type, payload: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const validationsResponse = validateUserEdit(formDataState);
    if (validationsResponse.length > 0)
      return setValidationMessages(validationsResponse);

    try {
      const response = await userRequester.edit(
        formDataState,
        user._id,
        user.accessToken
      );
      const jsonResponse = await response.json();
      if (response.status !== 200) throw { message: jsonResponse.message };
      if (response.status === 200) {
        login({ ...jsonResponse.user, accessToken: user.accessToken });
        return setSuccessModal(
          "Congrats!",
          jsonResponse.message,
          modalBtnHandlers,
          "Go to home"
        );
      }
    } catch (err) {
      return setFailedModal(
        "Something went wrong",
        err.message,
        () => resetModals(),
        "Try again"
      );
    }
  };

  function modalBtnHandlers() {
    resetModals();
    navigate("/home");
  }

  return (
    <>
      <h1 className="text-[#00df9a] text-2xl italic uppercase font-bold w-full text-center">
        Edit Profile
      </h1>
      <form onSubmit={submitHandler} className="mt-2">
        {validationMessages.length > 0
          ? validationMessages.map((x) => (
              <ValidationMessage key={x} message={x} />
            ))
          : null}

        <Input
          labelName={"First Name"}
          defaultValue={formDataState.firstName}
          changeState={changeFormDataState.bind(null, "firstName")}
        />
        <Input
          labelName={"Last Name"}
          defaultValue={formDataState.lastName}
          changeState={changeFormDataState.bind(null, "lastName")}
        />
        <Input
          labelName={"Email"}
          defaultValue={formDataState.email}
          changeState={changeFormDataState.bind(null, "email")}
        />
        <Input
          labelName={"Country"}
          defaultValue={formDataState.country}
          changeState={changeFormDataState.bind(null, "country")}
        />
        <Input
          labelName={"State"}
          defaultValue={formDataState.state}
          changeState={changeFormDataState.bind(null, "state")}
        />
        <Input
          labelName={"City"}
          defaultValue={formDataState.city}
          changeState={changeFormDataState.bind(null, "city")}
        />
        <Input
          labelName={"Zip Code"}
          defaultValue={formDataState.zipCode}
          changeState={changeFormDataState.bind(null, "zipCode")}
        />
        <Input
          labelName={"Country"}
          defaultValue={formDataState.country}
          changeState={changeFormDataState.bind(null, "country")}
        />
        <Input
          labelName={"Street"}
          defaultValue={formDataState.street}
          changeState={changeFormDataState.bind(null, "street")}
        />
        <Input
          labelName={"Unit Number"}
          defaultValue={formDataState.unitNumber}
          changeState={changeFormDataState.bind(null, "unitNumber")}
        />
        <Input
          labelName={"Phone Number"}
          defaultValue={formDataState.phoneNumber}
          changeState={changeFormDataState.bind(null, "phoneNumber")}
        />

        <div className="flex justify-center">
          <button className="mt-4 mb-4 py-2 px-16 rounded-lg bg-[#00df9a] text-white italic font-bold text-xl hover:bg-green-300 ease-in-out duration-500">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default modalMessages(EditProfile);
