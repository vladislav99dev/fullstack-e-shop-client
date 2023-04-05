import { Link } from "react-router-dom";

const FavouritesCard = ({
  product,
  toggleFavouritesMenu,
  removeFromFavouritesHandler
}) => {
    return (
        <li className="flex py-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img src={product.imageUrl} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." className="h-full w-full object-cover object-center"/>
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3 onClick={toggleFavouritesMenu}>
                <Link to={`products/${product.gender}/details/${product._id}`}>{product.name}</Link>
              </h3>
              <p className="ml-4">{`$${product.price}`}</p>
            </div>
            <p className="mt-1 text-md text-gray-500 font-bold capitalize">{product.brand}</p>
            <p className="mt-1 text-sm text-gray-500 capitalize">{product.color}</p>
          </div>
          <div className="flex flex-1 items-end justify-end text-sm">
            <div className="flex">
              <button onClick={removeFromFavouritesHandler} type="button" className="font-medium text-[#00df9a] hover:text-green-300 ">Remove</button>
            </div>
          </div>
        </div>
      </li>
    )
}

export default FavouritesCard;