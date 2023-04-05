import { Link } from "react-router-dom";

const ProductLayoutCard = ({ product }) => (
  <div className="group relative">
    <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 ease-in-out duration-500 lg:aspect-none sm:h-[25rem] lg:h-[30rem]">
      <img
        src={product.imageUrl}
        alt="Front of men&#039;s Basic Tee in black."
        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
      ></img>
    </div>
    <div className="mt-4 flex justify-between">
      <div>
        <h3 className="text-sm text-gray-700">
          <Link to={`details/${product._id}`}>
            <span
              id="name"
              aria-hidden="true"
              className="absolute inset-0"
            ></span>
            {product.name}
          </Link>
        </h3>
        <p id="color" className="mt-1 text-sm text-gray-500 capitalize">
          {product.color}
        </p>
      </div>
      <div>
        <p
          id="price"
          className={`text-sm font-medium text-gray-900 ${
            product.onSale && "line-through"
          }`}
        >{`$${product.price}`}</p>
        {product.onSale && (
          <p id="price" className="text-sm font-medium text-red-600">{`$${
            product.price - (product.price * product.salePercantage) / 100
          }`}</p>
        )}
      </div>
    </div>
  </div>
);

export default ProductLayoutCard;
