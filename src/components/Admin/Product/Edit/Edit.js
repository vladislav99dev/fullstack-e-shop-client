import { useEffect, useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../../context/AuthContext";
import { useModalsContext } from "../../../../context/ModalsContext";

import * as productsRequester from "../../../../services/productsRequester";
import productsValidations from "../../../../validations/productsValidations";
import { productSizeFormater } from "../../../../services/dataServices";

import isAdmin from "../../../../HOC/adminRoutesGuard";

import ValidationMessage from "../../../ValidationMessage/validationMessage";

import productData from "../../../../utils/productData";

import modalMessages from "../../../../HOC/modalMessages";

import styles from "./Edit.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const initialSelectStates = { type: "", category: "", gender: "", brand: "" };

const reducerSelectStates = (state, action) => {
  switch (action.type) {
    case "type":
      return {
        type: action.payload,
        category: state.category,
        gender: state.gender,
        brand: state.brand,
      };
    case "category":
      return {
        type: state.type,
        category: action.payload,
        gender: state.gender,
        brand: state.brand,
      };
    case "gender":
      return {
        type: state.type,
        category: state.category,
        gender: action.payload,
        brand: state.brand,
      };
    case "brand":
      return {
        type: state.type,
        category: state.category,
        gender: state.gender,
        brand: action.payload,
      };
    case "all":
      return {
        type: action.payload.type,
        category: action.payload.category,
        gender: action.payload.gender,
        brand: action.payload.brand,
      };
    default:
      return {
        type: "",
        category: "",
        gender: "",
        brand: "",
      };
  }
};

const Edit = () => {
  const [validationMessages, setValidationMessages] = useState([]);
  const [product, setProduct] = useState({});
  const [saleState, setSaleState] = useState(false);

  const [selectStates, dispatch] = useReducer(
    reducerSelectStates,
    initialSelectStates
  );
  const navigate = useNavigate();
  const { productId } = useParams();

  const { user } = useAuthContext();
  const { setFailedModal, setSuccessModal, resetModals } = useModalsContext();

  useEffect(() => {
    initialRequest(user.accessToken, productId)
      .then(({ response, jsonResponse }) => {
        if (response.status !== 200)
          throw {
            responseStatus: response.status,
            message: jsonResponse.message,
          };
        if (response.status === 200) {
          const result = productDisplaySizeFormatter(jsonResponse);
          setProduct(result);
          setSaleState(result.onSale)
          console.log(result);

          setAllSelectStates("all", {
            type: result.type,
            category: result.category,
            gender: result.gender,
            brand: result.brand,
          });
        }
      })
      .catch((err) => {
        if (err.responseStatus) setFailedModal(err.jsonResponse.message);
        console.log(err);
      });
  }, []);

  const initialRequest = async (accessToken, productId) => {
    const response = await productsRequester.getOne(
      null,
      accessToken,
      productId
    );
    const jsonResponse = await response.json();
    return { response, jsonResponse };
  };

  const productDisplaySizeFormatter = (product) => {
    product.sizes = JSON.stringify(product.sizes);
    product.sizes = product.sizes.replaceAll('"', "");
    product.sizes = product.sizes.replace("{", "");
    product.sizes = product.sizes.replace("}", "");
    return product;
  };

  const setSelectState = (state, event) => {
    dispatch({ type: state, payload: event.target.value });
  };

  const setAllSelectStates = (state, data) => {
    dispatch({ type: state, payload: data });
  };

  const saleButtonHandler = (e) => {
    if(e.target.value === 'false') setSaleState(false)
    if(e.target.value === 'true') setSaleState(true)
  }

  let sortedBrands = productData.brands.sort((a) =>
    a === product.brand ? -1 : 1
  );
  let sortedGenders = productData.genders.sort((a) =>
    a === product.gender ? -1 : 1
  );
  let sortedClothingOptions = productData.clothingOptions.sort((a) =>
    a === product.category ? -1 : 1
  );
  let sortedShoeOptions = productData.shoeOptions.sort((a) =>
    a === product.category ? -1 : 1
  );
  let sortedTypes = productData.types.sort((a) =>
    a === product.type ? -1 : 1
  );

  // const modalButtonHandler = () => {
  //   resetModals();
  //   navigate("/home");
  // };

  const submitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const formatedData = productSizeFormater(data);

    console.log(formatedData);

    let validationsResponse = productsValidations.validateAllData(formatedData);
    if (validationsResponse.length > 0)
      return setValidationMessages(validationsResponse);
    if (!validationsResponse.length) setValidationMessages([]);


    console.log(formatedData);

    try {
      const response = await productsRequester.edit(
        formatedData,
        user.accessToken,
        product._id,
        user._id
      );
      const jsonResponse = await response.json();

      if (response.status !== 200)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 200)
        setSuccessModal(
          "Congrats",
          "You have successfully updated the product!",
          resetModals,
          "Ho to home"
        );
    } catch (err) {
      if (err.status)
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
          what will we edit today?
        </h1>
        {validationMessages.length > 0 &&
          validationMessages.map((message) => (
            <ValidationMessage key={message} message={message} />
          ))}
        <form className={styles.form} onSubmit={submitHandler}>
          <select
            type="text"
            name="type"
            onChange={setSelectState.bind(null, "type")}
            value={selectStates.type}
            className={styles.select}
            placeholder=""
          >
            {productData.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            type="input"
            name="category"
            id="category"
            value={selectStates.category}
            onChange={setSelectState.bind(null, "category")}
          >
            {selectStates.type === "clothing"
              ? sortedClothingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              : sortedShoeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}{" "}
          </select>

          <input
            type="text"
            name="name"
            id="name"
            defaultValue={product.name}
          />

          <select
            type="input"
            name="gender"
            id="gender"
            onChange={setSelectState.bind(null, "gender")}
            value={selectStates.gender}
          >
            {sortedGenders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <select
            type="input"
            name="brand"
            id="brand"
            onChange={setSelectState.bind(null, "brand")}
            value={selectStates.brand}
          >
            {sortedBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <textarea
            type="input"
            name="sizes"
            defaultValue={product.sizes}
            placeholder={
              selectStates.type === "clothing"
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
            defaultValue={product.imageUrl}
          />

          <select
            type="input"
            name="color"
            id="color"
            defaultValue={product.color}
          >
            {productData.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price:"
            defaultValue={product.price}
          />
          <fieldset className="flex justify-center text-xl gap-x-4">
            <div className="flex gap-x-1">
              {saleState ? (
                <input type="radio" id="onSale" name="onSale" defaultChecked  value={true} onClick={(e) => saleButtonHandler(e)} />
                ) : (
                  <input type="radio" id="onSale" name="onSale" value={true} onClick={(e) => saleButtonHandler(e)} />
              )}
              <label htmlFor="onSale">On Sale</label>
            </div>
            <div className="flex gap-x-1">
              {saleState  ? (
                <input type="radio" id="offSale" name="onSale"  value={false} onClick={(e) => saleButtonHandler(e)} />
              ) : (
                <input type="radio" id="offSale" name="onSale" defaultChecked value={false} onClick={(e) => saleButtonHandler(e)} />
              )}
              <label htmlFor="offSale">Off Sale</label>
            </div>
          </fieldset>

          <input
            type="text"
            name="salePercantage"
            id="percantage"
            placeholder="Percantage Off"
            disabled={!saleState}
            defaultValue={product?.salePercantage}
          />
          <div className={styles.btnContainer}>
            <button className={styles["submit-btn"]}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default isAdmin(modalMessages(Edit));
