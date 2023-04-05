import { useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useModalsContext } from "../../../context/ModalsContext";

import { removeFromCart } from "../../../services/favouritesAndCartRequester";

import { useLocalProductsContext } from "../../../context/LocalProductsContext";

import CartCard from "./CartCard";
import CartFooter from "./CartFooter";
import CartHeader from "./CartHeader";
import Spinner from "../../Spinner/Spinner";

import modalMessages from "../../../HOC/modalMessages";

const CartLayout = ({ toggleCartMenu }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { products, removeProduct } = useLocalProductsContext();

  const { setFailedModal, resetModals } = useModalsContext();
  const { user, login } = useAuthContext();

  useEffect(() => {
    if (user.email) {
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
    }
    if (!user.email)
      products.map((product) =>
        setTotalPrice((prev) => {
          if (product.product.onSale)
            return (
              prev +
              (product.product.price -
                product.product.price *
                  (product.product.salePercantage / 100)) *
                product.quantity
            );
          return prev + product.product.price * product.quantity;
        })
      );
  }, []);

  const removeProductFromStorage = (product, size, event) => {
    event.preventDefault();
    removeProduct(product, size);
    if (products.length > 0)
      return products.map((product) => {
        if (product.product.onSale)
          return setTotalPrice(
            product.product.price -
              product.product.price *
                (product.product.salePercantage / 100) *
                product.quantity
          );
        return setTotalPrice(product.product.price * product.quantity);
      });
    if (products.length <= 0) setTotalPrice(0);
  };

  const removeFromCartHandler = async (productId, size, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await removeFromCart(user._id, productId, size);
      const jsonResponse = await response.json();
      setIsLoading(false);

      if (response.status !== 200)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 200) {
        login(jsonResponse);
        if (jsonResponse.cart.length > 0)
          return jsonResponse.cart.map((product) => {
            if (product._id.onSale)
              return setTotalPrice(
                product._id.price -
                  product._id.price *
                    (product._id.salePercantage / 100) *
                    product.quantity
              );

            return setTotalPrice(product._id.price * product.quantity);
          });
        if (jsonResponse.cart.length <= 0) {
          setTotalPrice(0);
        }
      }
    } catch (err) {
      setIsLoading(false);
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
      <div
        className="relative z-30"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        {/* <!--
    Background backdrop, show/hide based on slide-over state.
    
    Entering: "ease-in-out duration-500"
    From: "opacity-0"
    To: "opacity-100"
    Leaving: "ease-in-out duration-500"
    From: "opacity-100"
    To: "opacity-0"
  --> */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* <!--
          Slide-over panel, show/hide based on slide-over state.
          
          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-full"
          To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-0"
          To: "translate-x-full"
        --> */}
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <CartHeader toggleCartMenu={toggleCartMenu} />
                    <p className="mt-2 text-sm font-semibold text-primary-dark-400">
                      Note: It's not enough to add a product to your cart in
                      order to save it!
                    </p>
                    <div className="mt-4">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {isLoading ? <Spinner /> : null}

                          {products.length > 0 &&
                            products.map(({ product, quantity, size }) => (
                              <CartCard
                                key={`${product._id}${size}`}
                                product={product}
                                quantity={quantity}
                                size={size}
                                toggleCartMenu={toggleCartMenu}
                                removeHandler={removeProductFromStorage.bind(
                                  null,
                                  product,
                                  size
                                )}
                              />
                            ))}

                          {user.email &&
                            user.cart.length > 0 &&
                            user.cart.map((product) => {
                              return product._id.inStock ? (
                                <CartCard
                                  key={`${product._id._id}${product.size}`}
                                  product={product._id}
                                  quantity={product.quantity}
                                  size={product.size}
                                  toggleCartMenu={toggleCartMenu}
                                  removeHandler={removeFromCartHandler.bind(
                                    null,
                                    product._id._id,
                                    product.size
                                  )}
                                />
                              ) : (
                                <div className="opacity-50">
                                  <CartCard
                                    key={`${product._id._id}${product.size}`}
                                    product={product._id}
                                    quantity={product.quantity}
                                    size={product.size}
                                    toggleCartMenu={toggleCartMenu}
                                    removeHandler={removeFromCartHandler.bind(
                                      null,
                                      product._id._id,
                                      product.size
                                    )}
                                  />
                                </div>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <CartFooter
                    totalPrice={totalPrice}
                    toggleCartMenu={toggleCartMenu}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default modalMessages(CartLayout);
