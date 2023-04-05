import { useState } from "react";
import { useModalsContext } from "../../../context/ModalsContext";
import { useAuthContext } from "../../../context/AuthContext";
import * as favouritesAndCartRequester from "../../../services/favouritesAndCartRequester";

import FavouritesCard from "./FavouritesCard";
import FavouritesFooter from "./FavouritesFooter";
import FavouritesHeader from "./FavouritesHeader";
import AttentionModal from "../../Modals/AttentionModal";

import modalMessages from "../../../HOC/modalMessages";
import Spinner from "../../Spinner/Spinner";


const FavouritesLayout = ({ toggleFavouritesMenu }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setFailedModal, resetModals, modalState } = useModalsContext();
  const { user, login } = useAuthContext();

  const removeFromFavouritesHandler = async (productId, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await favouritesAndCartRequester.removeFromFavourties(
        user._id,
        productId
      );
      const jsonResponse = await response.json();
      setIsLoading(false);

      if (response.status !== 200)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 200) login(jsonResponse);
    } catch (err) {
      setIsLoading(false);
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
    <div>
      <div
        className="relative z-30"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >

        {/* //   <!--
      //     Background backdrop, show/hide based on slide-over state.
      
      //     Entering: "ease-in-out duration-500"
      //       From: "opacity-0"
      //       To: "opacity-100"
      //     Leaving: "ease-in-out duration-500"
      //       From: "opacity-100"
      //       To: "opacity-0"
      //   --> */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* // <!--
              //   Slide-over panel, show/hide based on slide-over state.
      
              //   Entering: "transform transition ease-in-out duration-500 sm:duration-700"
              //     From: "translate-x-full"
              //     To: "translate-x-0"
              //   Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
              //     From: "translate-x-0"
              //     To: "translate-x-full"
              // --> */}

              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <FavouritesHeader
                      toggleFavouritesMenu={toggleFavouritesMenu}
                    />
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            user.favourites.map((favourite) => (
                              <FavouritesCard
                                key={favourite._id}
                                product={favourite}
                                toggleFavouritesMenu={toggleFavouritesMenu}
                                removeFromFavouritesHandler={removeFromFavouritesHandler.bind(
                                  null,
                                  favourite._id
                                )}
                              />
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <FavouritesFooter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default modalMessages(FavouritesLayout);
