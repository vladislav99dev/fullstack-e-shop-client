import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateLogin } from "../../validations/userValidations";
import * as userRequester from "../../services/userRequester";
import * as favouritesAndCartRequester from "../../services/favouritesAndCartRequester";

import { useAuthContext } from "../../context/AuthContext";
import { useLocalProductsContext } from "../../context/LocalProductsContext";
import { useModalsContext } from "../../context/ModalsContext";

import { isNotLoggedIn } from "../../HOC/routesGuard";

import ValidationMessage from "../ValidationMessage/validationMessage";
import Spinner from "../Spinner/Spinner";

import modalMessages from "../../HOC/modalMessages";

import styles from "./Login.module.css";

const Login = () => {
  const [validationMessages, setValidationMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuthContext();

  const { products, clearStorage } = useLocalProductsContext();
  const { setFailedModal, resetModals } = useModalsContext();

  const addProductsFromLocalStorageToUserCart = async (profileId) => {
    const failedAddMessages = [];
    let user = {};
    for (const product of products) {
      const response = await favouritesAndCartRequester.addToCart(
        profileId,
        product.product._id,
        product.size,
        product.quantity
      );
      const jsonResponse = await response.json();
      if (response.status !== 200) failedAddMessages.push(jsonResponse.message);
      if (response.status === 200) user = {...jsonResponse};
    }
    return [user, failedAddMessages.join(" ")];
  };



  const loginHandler = async (event) => {
    event.preventDefault();
    setValidationMessages([]);
    setIsLoading(true);

    const formdData = new FormData(event.target);
    const data = Object.fromEntries(formdData);

    const validationsResponse = validateLogin(data);
    if (validationsResponse.length > 0) {
      setIsLoading(false);
      return setValidationMessages(validationsResponse);
    }

    try {
      let userData = {};
      const response = await userRequester.login(data);
      const jsonResponse = await response.json();

      if (response.status !== 200) {
        setIsLoading(false);
        return setFailedModal(
          "Something went wrong",
          jsonResponse.message,
          () => resetModals(),
          "Try again"
        );
      }

      Object.assign(userData, jsonResponse.user);

      if (products.length > 0) {
        const [user, failedAddMessages] =
          await addProductsFromLocalStorageToUserCart(userData._id);
          // console.log(user,failedAddMessages);
        if (failedAddMessages)
          setFailedModal(
            "Something went wrong",
            "There were some products that we currently dont have as much as you wanted in stock, so we removed them from your cart and added the ones we have.We are sorry for the issues :)",
            () => {
              resetModals();
            },
            "Go to home"
          );
        if (user.hasOwnProperty("email")) Object.assign(userData, user);
        clearStorage();
      }

      login(userData);
      navigate("/home");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <Spinner />}
      <div>
        {validationMessages.length > 0 &&
          validationMessages.map((message) => (
            <ValidationMessage key={message} message={message} />
          ))}
        {!isLoading ? (
          <form className={styles.form} onSubmit={loginHandler}>
            {!isLoading && <h1 className={styles.heading}>Login</h1>}
            <div className={styles.inputsContainer}>
              <input
                type="text"
                name="email"
                className=""
                placeholder="Email:"
              />
              <input type="password" name="password" placeholder="Password:" />
            </div>
            <div className={styles.signInContainer}>
              <p className="">You dont have an account?</p>
              <Link to={"users/register"} className="text-primary-dark-100">
                Sign in
              </Link>
            </div>
            <div className={styles.btnContainer}>
              <button className={styles.submitBtn}>Submit</button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default isNotLoggedIn(modalMessages(Login));
