import { Link } from "react-router-dom";

const CartCard = ({
  product,
  quantity,
  size,
  toggleCartMenu,
  removeHandler,
}) => {
  return (
    <>
      <li className="flex py-6 hover:bg-gray-100 rounded-md ease-in duration-100">
        <div className="h-36 w-36 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={product.imageUrl}
            alt="Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch."
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3 onClick={toggleCartMenu}>
                <Link to={`/products/${product.gender}/details/${product._id}`}>
                  {product.name}
                </Link>
                {!product.inStock && <p>Product is currently not in stock</p>}
              </h3>
              {!product.onSale ? (
                <p className="text-primary-dark-200 text-lg">{`$${product.price}`}</p>
              ) : (
                <p className="text-lg text-red-600 ">{`$${
                  product.price - product.price * (product.salePercantage / 100)
                }`}</p>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 capitalize">{`${product.color}`}</p>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-base text-primary-dark-700">{`Size: ${size}`}</p>
            <p className="text-base text-primary-dark-700">{`Qty: ${quantity}`}</p>
            <div className="flex">
              <button
                onClick={removeHandler}
                type="button"
                className=" text-base font-medium text-primary-dark-800 hover:text-primary-dark-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};
export default CartCard;
