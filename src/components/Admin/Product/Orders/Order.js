import React, { useState, useEffect } from "react";

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

import styles from "./Order.module.css";

const Order = ({ data, updateOrderHandler }) => {
  console.log(data);
  const [order, setOrder] = useState({});
  const [currProduct, setCurrProduct] = useState({});
  const [selectState, setSelectState] = useState("");

  useEffect(() => {
    if (data) {
      setOrder(data);
      setCurrProduct({
        productIndex: 0,
        product: data.orderInfo.productsOrdered[0],
      });
      setSelectState(data?.orderInfo?.orderStatus);
      console.log(data);
    }
  }, []);

  const handleSelect = (event) => {
    if (event.target.value === "Delivered") setSelectState("Delivered");
    if (event.target.value === "Not Delivered") setSelectState("Not Delivered");
  };

  const simpleSlider = (direction) => {
    const productsOrderedLength = order?.orderInfo?.productsOrdered.length;
    if (direction === "right") {
      if (currProduct.productIndex + 1 == productsOrderedLength) {
        return setCurrProduct({
          productIndex: 0,
          product: data.orderInfo.productsOrdered[0],
        });
      }
      setCurrProduct({
        productIndex: currProduct.productIndex + 1,
        product: order.orderInfo.productsOrdered[currProduct.productIndex + 1],
      });
    }
    if (direction === "left") {
      if (currProduct.productIndex - 1 < 0) {
        return setCurrProduct({
          productIndex: productsOrderedLength - 1,
          product: data.orderInfo.productsOrdered[productsOrderedLength - 1],
        });
      }
      setCurrProduct({
        productIndex: currProduct.productIndex - 1,
        product: order.orderInfo.productsOrdered[currProduct.productIndex - 1],
      });
    }
  };

  return (
    <div className="">
      <div className={styles.container}>
        <div className="relative">
          <img
            className="h-[300px] w-[250px]"
            src={currProduct.product?._id?.imageUrl}
            alt=""
          />
          {data?.orderInfo?.productsOrdered?.length > 1 && (
            <>
              <div
                className="absolute top-[50%] left-0 translate-y-[-50%] cursor-pointer"
                onClick={simpleSlider.bind(null, "left")}
              >
                <AiOutlineArrowLeft size={30} />
              </div>
              <div
                className="absolute top-[50%] right-0 translate-y-[-50%] cursor-pointer"
                onClick={simpleSlider.bind(null, "right")}
              >
                <AiOutlineArrowRight size={30} />
              </div>
            </>
          )}
        </div>

          <>
            <div className={styles.productInfoContainer}>
              <h2>Product information:</h2>
              <p>{`Size:${currProduct?.product?.size}`}</p>
              <p>{`Quantity:${currProduct?.product?.quantity}`}</p>
            </div>
            <div className={styles.orderInfoContainer}>
              <h2>Order information:</h2>
              <p>{`Client name:${order?.clientInfo?.firstName} ${order?.clientInfo?.lastName}`}</p>
              <p>{`Email:${order?.clientInfo?.email}`}</p>
              <p>{`Delivery Address:${order?.clientInfo?.city},${order?.clientInfo?.country},str.${order?.clientInfo?.street} N${order?.clientInfo?.unitNumber}`}</p>
            </div>
            <div>
              <div className={styles.selectContainer}>
                <select
                  type="text"
                  name="type"
                  onChange={handleSelect}
                  value={selectState}
                >
                  <option value={`Delivered`}>Delivered</option>
                  <option value={`Not Delivered`}>Not Delivered</option>
                </select>

                <button
                  onClick={updateOrderHandler.bind(
                    null,
                    order?.orderInfo?.orderId,
                    selectState
                  )}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
      </div>
    </div>
  );
};

export default Order;
