const FavouritesFooter = () => {
    return (
        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
        {/* <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>$262.00</p>
        </div> */}
        {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
        <div className="mb-6 mt-6">
          <a href="#" className="flex items-center justify-center rounded-md border border-transparent bg-[#00df9a] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-300">Continue</a>
        </div>
        {/* <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div> */}
      </div>
    )
}
export default FavouritesFooter