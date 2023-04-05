import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as productsRequester from "../../../services/productsRequester";
import * as favouritesAndCartRequester from "../../../services/favouritesAndCartRequester";

import { useModalsContext } from "../../../context/ModalsContext";
import { useAuthContext } from "../../../context/AuthContext";
import { useNavTogglesContext } from "../../../context/NavTogglesContext";
import { useLocalProductsContext } from "../../../context/LocalProductsContext";

// import AttentionModal from "../../Modals/AttentionModal";
import modalMessages from "../../../HOC/modalMessages";
import Spinner from "../../Spinner/Spinner";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { productId } = useParams();
  const navigate = useNavigate();

  const { modalState, setFailedModal, resetModals } = useModalsContext();
  const { user, login } = useAuthContext();
  const { toggleCartMenu, toggleFavouritesMenu } = useNavTogglesContext();
  const { addProduct } = useLocalProductsContext();

  useEffect(() => {
    setIsLoading(true);
    initialRequset(productId)
      .then(({ response, jsonResponse }) => {
        setIsLoading(false);
        if (response.status !== 200)
          throw {
            responseStatus: response.status,
            message: jsonResponse.message,
          };
        if (response.status === 200) setProduct(jsonResponse);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.responseStatus)
          return setFailedModal(
            "Something went wrong",
            err.message,
            () => {
              modalButtonHandler();
            },
            "Try again"
          );
      });
  }, [productId]);

  const initialRequset = async (id) => {
    const response = await productsRequester.getOne(null, null, id);
    const jsonResponse = await response.json();
    return { response, jsonResponse };
  };

  const clothingText =
    "Made from soft fabric for lasting comfort, the Paris Saint-Germain T-Shirt has signature details to let you show everyone who you support";
  const shoeText =
    "At home on Italian runways and local neighbourhood streets, the Nike Air Max Plus 3 features a design that's ahead of its time.";
  const quantitySelect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const addToUserCartHandler = async (event) => {
    event.preventDefault();
    if (size === "")
      return setFailedModal(
        "Something went wrong",
        "You should select size first",
        () => {
          modalButtonHandler();
        },
        "Try again"
      );
    setIsLoading(true);
    try {
      const response = await favouritesAndCartRequester.addToCart(
        user._id,
        product._id,
        size,
        quantity
      );
      const jsonResponse = await response.json();
      if (response.status !== 200)
        setFailedModal(
          "Something went wrong",
          jsonResponse.message,
          () => {
            modalButtonHandler();
          },
          "Try again"
        );
      if (response.status === 200) {
        login(jsonResponse);
        setSize("");
        setQuantity(1);
        toggleCartMenu();
        setIsLoading(false);
      }
    } catch (err) {
      setSize("");
      setQuantity(1);
      setIsLoading(false);
      console.log(err);
    }
  };

  const addToLocalStorage = async (event) => {
    event.preventDefault();
    if (!size)
      return setFailedModal(
        "Something went wrong",
        "You should select size first",
        () => {
          modalButtonHandler();
        },
        "Try again"
      );
    try {
      const response = await productsRequester.getOne(null, null, productId);
      const jsonResponse = await response.json();
      addProduct(jsonResponse, size, quantity);
      toggleCartMenu();
    } catch (err) {
      console.log(err);
    }
  };

  const addToFavouritesHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await favouritesAndCartRequester.addToFavourites(
        user._id,
        product._id
      );
      const jsonResponse = await response.json();
      if (response.status !== 200)
        setFailedModal(
          "Something went wrong",
          jsonResponse.message,
          () => {
            modalButtonHandler();
          },
          "Try again"
        );
      if (response.status === 200) {
        login(jsonResponse);
        setIsLoading(false);
        toggleFavouritesMenu();
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const denyAccessToFavourites = (event) => {
    event.preventDefault();
    setFailedModal(
      "Something went wrong",
      "You should be logged in to use this feature!",
      () => {
        modalButtonHandler();
      },
      "Try again"
    );
  };

  const setSizeChoice = (event) => {
    event.preventDefault();
    const [size, qty] = event.target.value.split(",");
    if (Number(qty) > 0) {
      setSize(size);
    }
  };
  const setQuantityChoice = (event) => {
    setQuantity(Number(event.target.value));
  };
  const modalButtonHandler = () => {
    setIsLoading(false);
    resetModals();
  };
  const editAndDeleteButtonHandlers = (action, productId) => {
    return navigate(`/admin/products/${productId}/${action}`);
  };

  return (
    <div className="p-10">
      {isLoading ? (
        <Spinner />
      ) : (
        <div id="wrapper" className={styles.container}>
          <div className={styles["product-info"]}>
            <p>{`${product.gender}'s ${product.type}`}</p>
            <p>{product.name}</p>
            <p
              className={`${product.onSale && "line-through !text-black"}`}
            >{`USD $${product.price}`}</p>
            {product.onSale && (
              <p className={styles["sale-price"]}>{`USD $${
                product.price - product.price * (product.salePercantage / 100)
              }`}</p>
            )}
            <p>{product.type === "clothing" ? clothingText : shoeText}</p>
          </div>

          <img
            className={styles["product-poster"]}
            src={`${product.imageUrl}`}
            alt={`${product.name}`}
          />

          <form
            onSubmit={user.email ? addToUserCartHandler : addToLocalStorage}
            id="sizesAndButtons"
            className={styles.form}
          >
            <p>Select Size</p>
            <div className={styles["sizes-container"]}>
              {Object.entries(product.sizes).map(([shoeSize, qty]) => (
                <button
                  key={shoeSize}
                  value={[shoeSize, qty]}
                  onClick={setSizeChoice}
                  className={
                    qty > 0
                      ? `${styles["btn-default"]} ${
                          shoeSize === size && styles["btn-selected"]
                        }`
                      : styles["btn-disabled"]
                  }
                >
                  {shoeSize}
                </button>
              ))}
            </div>
            <div className={styles["select-container"]}>
              <label className="text-lg" htmlFor="selectQuantity">
                Select quantity
              </label>
              <select
                name="selectQuantity"
                className={styles.select}
                onChange={setQuantityChoice}
              >
                {quantitySelect.map((item) => {
                  return (
                    <option className={styles["select-option"]} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.adminButtons}>
              <div className={styles["btns-container"]}>
                <button
                  type="submit"
                  className={`${styles["btn-service-default"]} bg-primary-darkest hover:bg-primary-dark-600 text-primary-lightest w-[500px]`}
                >
                  Add to cart
                </button>
              </div>
              <div className={styles["btns-container"]}>
                <button
                  className={`${styles["btn-service-default"]} border-2 border-primary-darkest text-primary-darkest w-[500px]`}
                  onClick={
                    user.email ? addToFavouritesHandler : denyAccessToFavourites
                  }
                >
                  Add to favourites &#x2764;
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {user.accessToken && (
        <div className="flex flex-col items-center mt-10">
          <div className={styles["btns-container"]}>
            <button
              className={`${styles["btn-service-default"]} bg-primary-100 w-[300px] md:w-[500px]`}
              onClick={editAndDeleteButtonHandlers.bind(
                null,
                "edit",
                product._id
              )}
            >
              Edit
            </button>
          </div>
          <div className={styles["btns-container"]}>
            <button
              className={`${styles["btn-service-default"]} bg-red-500 text-white hover:bg-red-300 w-[300px] md:w-[500px]`}
              onClick={editAndDeleteButtonHandlers.bind(
                null,
                "delete",
                product._id
              )}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default modalMessages(ProductDetails);
