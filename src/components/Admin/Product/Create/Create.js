import { useState } from "react";

import { useAuthContext } from "../../../../context/AuthContext";
import { useModalsContext } from "../../../../context/ModalsContext";

import * as productsRequester from "../../../../services/productsRequester";
import { productSizeFormater } from "../../../../services/dataServices";
import productsValidations from "../../../../validations/productsValidations";

import productData from "../../../../utils/productData";

import isAdmin from "../../../../HOC/adminRoutesGuard";

import ValidationMessage from "../../../ValidationMessage/validationMessage";
import modalMessages from "../../../../HOC/modalMessages";

import styles from "./Create.module.css";

const Create = () => {
  const { user } = useAuthContext();
  const [type, setType] = useState("clothing");
  const [validationMessages, setValidationMessages] = useState([]);
  const { setSuccessModal, setFailedModal, resetModals } = useModalsContext();

  const handleSelect = (event) => {
    setType(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const formatedData = productSizeFormater(data);

    let validationsResponse = productsValidations.validateAllData(formatedData);
    if (validationsResponse.length > 0)
      return setValidationMessages(validationsResponse);
    if (!validationsResponse.length) setValidationMessages([]);

    try {
      const response = await productsRequester.create(
        formatedData,
        user.accessToken,
        null,
        user._id
      );
      const jsonResponse = await response.json();

      if (response.status !== 201)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 201)
        setSuccessModal(
          "Congrats!",
          "You have successfully create new product!",
          () => {
            resetModals();
          },
          "Make another one"
        );
    } catch (err) {
      if (err.responseStatus)
        return setFailedModal(
          "Something went wrong",
          err.message,
          () => {
            resetModals();
          },
          "Try again"
        );
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          Hello, {user.firstName}
          <br />
          what product we will create today?
        </h1>
        {validationMessages.length > 0 &&
          validationMessages.map((message) => (
            <ValidationMessage key={message} message={message} />
          ))}
        <form className={styles.form} onSubmit={submitHandler}>
          <select
            type="text"
            name="type"
            onChange={handleSelect}
            placeholder=""
          >
            {productData.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select type="input" name="category" id="category">
            {type === "clothing"
              ? productData.clothingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : productData.shoeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}{" "}
          </select>

          <input
            type="text"
            name="name"
            id="name"
            placeholder="Product Name:"
          />

          <select type="input" name="gender" id="gender">
            {productData.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <select type="input" name="brand" id="brand">
            {productData.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <textarea
            type="input"
            name="sizes"
            placeholder={
              type === "clothing"
                ? "ex: XL:5, M:15, S:13 You should add comma as shown in example,without spacing between double dots!"
                : "ex: 43:10, 46:15, 42:13 You should add comma as shown in example"
            }
            id="sizes"
          ></textarea>

          <input
            type="input"
            name="imageUrl"
            id="imageUrl"
            placeholder="ImageUrl:"
          />

          <select type="input" name="color" id="color">
            {productData.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

          <input type="number" name="price" id="price" placeholder="Price:" />
          <div className={styles.btnContainer}>
            <button className={styles["submit-btn"]}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default isAdmin(modalMessages(Create));
