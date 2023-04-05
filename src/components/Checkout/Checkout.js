import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiTigerHead } from "react-icons/gi";

import { useAuthContext } from "../../context/AuthContext";
import { useLocalProductsContext } from "../../context/LocalProductsContext";
import { useModalsContext } from "../../context/ModalsContext";

import ordersRequester from "../../services/ordersRequester";

import { validateOrderUserInfo } from "../../validations/userValidations";

import modalMessages from "../../HOC/modalMessages";
import Spinner from "../Spinner/Spinner";
import ValidationMessage from "../ValidationMessage/validationMessage";

import styles from "./Checkout.module.css";

const Checkout = () => {
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [validationMessages, setValidationMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { user, login } = useAuthContext();
  const { products } = useLocalProductsContext();
  const { setFailedModal, setSuccessModal, resetModals } = useModalsContext();

  useEffect(() => {
    if (user.email)
      user.cart.map((product) =>
        setTotalPrice((prev) => {
          if (product._id.onSale)
            return (
              prev +
              (product._id.price -
                product._id.price * (product._id.salePercantage / 100)) *
                product.quantity
            );
          return prev + product._id.price * product.quantity;
        })
      );
    if (!user.email)
      products.map((product) =>
        setTotalPrice((prev) => {
          if (product.product.onSale)
            return (
              prev +
              (product.product.price -
                product.product.price * (product.product.salePercantage / 100)) *
                product.quantity
            );
          return prev + product.product.price * product.quantity;
        })
      );

    return () => {
      setTotalPrice(0);
    };
  }, [user, products]);

  const fillFormWithUserInfo = (event) => {
    event.preventDefault();
    setUseProfileInfo(!useProfileInfo);
  };

  const checkoutHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data["price"] = totalPrice;

    let validationsResponse = validateOrderUserInfo(data);
    if (validationsResponse.length > 0)
      return setValidationMessages(validationsResponse);
    if (!validationsResponse.length) setValidationMessages([]);

    try {
      let response;
      setIsLoading(true);
      if (user.email)
        response = await ordersRequester.createOrder(data, user._id, null);
      if (!user.email)
        response = await ordersRequester.createOrder(data, null, products);
      const jsonResponse = await response.json();
      setIsLoading(false);

      if (response.status !== 201)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 201) {
        if (user.email) login(jsonResponse.user);
        return setSuccessModal(
          "Congrats!",
          jsonResponse.message,
          modalButtonHandler,
          "Go to home"
        );
      }
    } catch (err) {
      console.log(err);
      if (err.responseStatus)
        return setFailedModal(
          "Something went wrong",
          err.message,
          () => resetModals(),
          "Try again"
        );
    }
  };

  function modalButtonHandler() {
    resetModals();
    navigate("/home");
  }

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <div>
        <form className={styles.container} onSubmit={checkoutHandler}>
          {validationMessages.length > 0
            ? validationMessages.map((message) => (
                <ValidationMessage key={message} message={message} />
              ))
            : null}
          <div className={styles["form-header"]}>
            <p className={styles["text-header"]}>Shipping information</p>
            {user.email && (
              <button
                onClick={fillFormWithUserInfo}
                className={styles["use-profile-info-btn"]}
              >
                Click to use profile information
              </button>
            )}
          </div>
          <div className={styles["break-line"]}></div>

          <div className={styles["form-body"]}>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name *"
              defaultValue={useProfileInfo ? `${user.firstName}` : ""}
            />
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name *"
              defaultValue={useProfileInfo ? `${user.lastName}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              defaultValue={useProfileInfo ? `${user.email}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="street"
              id="street"
              placeholder="Street Address *"
              defaultValue={useProfileInfo ? `${user.street}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="unitNumber"
              id="unitNumber"
              placeholder="Apartment/House Number# *"
              defaultValue={useProfileInfo ? `${user.unitNumber}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="country"
              id="country"
              placeholder="Country *"
              defaultValue={useProfileInfo ? `${user.country}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="city"
              id="city"
              placeholder="City *"
              defaultValue={useProfileInfo ? `${user.city}` : ""}
            />

            <input
              type="text"
              name="state"
              id="state"
              placeholder="State *"
              defaultValue={useProfileInfo ? `${user.state}` : ""}
            />
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              placeholder="Zip Code *"
              defaultValue={useProfileInfo ? `${user.zipCode}` : ""}
            />
            <input
              className="col-span-2"
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="Phone: ex.0988902378 *"
              defaultValue={useProfileInfo ? `${user.phoneNumber}` : ""}
            />
          </div>
          <div>
            <div className={styles["order-summary"]}>
              <p className={styles["order-summary-header"]}>Order Summary</p>

              {user.email
                ? user.cart.map((product) => (
                    <div
                      key={`${product._id._id}${product.size}`}
                      className={styles["order-summary-product-container"]}
                    >
                      <p>{product._id.name}</p>
                      <div>
                        <p>{`Quantity: ${product.quantity}`}</p>
                        {!product._id.onSale ? (
                          <p className="text-primary-100 text-right text-lg">{`$${product._id.price}`}</p>
                        ) : (
                          <p className="text-lg text-red-600 text-right">{`$${
                            product._id.price -
                            product._id.price *
                              (product._id.salePercantage / 100)
                          }`}</p>
                        )}
                        {/* <p className="text-primary-100 text-right">{`$${product._id.price}`}</p> */}
                      </div>
                    </div>
                  ))
                : products.map((product) => (
                    <div
                      key={`${product.product._id}${product.size}`}
                      className={styles["order-summary-product-container"]}
                    >
                      <p>{product.product.name}</p>
                      <div>
                        <p>{`Quantity: ${product.quantity}`}</p>
                        {!product.product.onSale ? (
                          <p className="text-primary-100 text-right text-lg">{`$${product.product.price}`}</p>
                        ) : (
                          <p className="text-lg text-red-600 text-right">{`$${
                            product.product.price -
                            product.product.price *
                              (product.product.salePercantage / 100)
                          }`}</p>
                        )}
                      </div>
                    </div>
                  ))}

              <div className={styles["order-summary-total-price"]}>
                <p>Total:</p>
                <p className="text-primary-100">{`$${totalPrice.toFixed(
                  2
                )}`}</p>
              </div>
            </div>

            <button className={styles["submit-button"]} type="submit">
              Submit
            </button>

            <div className={styles.card}>
              <GiTigerHead size={100} color={"#00c98b"} />
              <div className={styles["card-text"]}>
                <p>We are glad you choose us!</p>
                <p>You will get a free shipping from your next order!</p>
                <p>Best regards,</p>
                <p className="text-end font-bold text-xl uppercase text-primary-dark-200 mt-2">
                  - Supreme fashion shop
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default modalMessages(Checkout);
