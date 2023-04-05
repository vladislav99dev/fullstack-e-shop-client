import { createContext, useContext,  useReducer } from "react";

const NavTogglesContext = createContext();

const initialMenuState = {
  isUserMobileLinksActive: false,
  isProductsMobileLinksActive: false,
  isDesktopUserLinksActive: false,
  isCartMenuActive:false,
  isFavouritesMenuActive:false
};

const reducerMenuState = (state, action) => {
  switch (action.type) {
    case "setUserMobileLinks":
        return {
            isUserMobileLinksActive: !state.isUserMobileLinksActive,
            isProductsMobileLinksActive: false,
            isDesktopUserLinksActive: false,
            isCartMenuActive:false,
            isFavourinuActive: false
        };
    case "setProductsMobileLinks":
        return {
            isUserMobileLinksActive: false,
            isProductsMobileLinksActive: !state.isProductsMobileLinksActive,
            isDesktopUserLinksActive: false,
            isCartMenuActive:false,
            isFavouritesMenuActive: false
        };
    case "setDesktopUserLinks":
        return {
            isUserMobileLinksActive: false,
            isProductsMobileLinksActive: false,
            isDesktopUserLinksActive: !state.isDesktopUserLinksActive,
            isCartMenuActive:false,
            isFavouritesMenuActive: false
        };
    case "setCartMenu": 
        return {
          isUserMobileLinksActive: false,
          isProductsMobileLinksActive: false,
          isDesktopUserLinksActive: false,
          isCartMenuActive: !state.isCartMenuActive,
          isFavouritesMenuActive: false
        }
    case "setFavouriteMenu": 
        return {
          isUserMobileLinksActive: false,
          isProductsMobileLinksActive: false,
          isDesktopUserLinksActive: false,
          isCartMenuActive: false,
          isFavouritesMenuActive: !state.isFavouritesMenuActive
        }     
    case "resetAll": 
        return {
          isUserMobileLinksActive: false,
          isProductsMobileLinksActive: false,
          isDesktopUserLinksActive: false,
          isCartMenuActive: false,
          isFavouritesMenuActive: false
        }
    default:
      return{
        isUserMobileLinksActive: false,
        isProductsMobileLinksActive: false,
        isDesktopUserLinksActive: false,
        isCartMenuActive:false,
        isFavouritesMenuActive: false
      }
  }
};

export const NavTogglesProvider = ({ children }) => {
  const[state,dispatch] = useReducer(reducerMenuState,initialMenuState);

  const toggleUserMenu = () => {
    console.log('clicking');
    dispatch({type:'setUserMobileLinks'})
  };

  const toggleProductsMenu = () => {
    dispatch({type:'setProductsMobileLinks'})
  };

  const toggleDesktopUserMenu = () => {
    dispatch({type:'setDesktopUserLinks'})
  };
  
  const toggleCartMenu = () => {
    dispatch({type:'setCartMenu'})
  }
  const toggleFavouritesMenu = () => {
    dispatch({type:'setFavouriteMenu'})
  }

  const outsideClick = () => {
    dispatch({type:'resetAll'});
  }

  return (
    <NavTogglesContext.Provider
      value={{
        isUserMobileLinksActive:state.isUserMobileLinksActive,
        toggleUserMenu,
        isProductsMobileLinksActive:state.isProductsMobileLinksActive,
        toggleProductsMenu,
        isDesktopUserLinksActive:state.isDesktopUserLinksActive,
        toggleDesktopUserMenu,
        isCartMenuActive:state.isCartMenuActive,
        toggleCartMenu,
        isFavouritesMenuActive:state.isFavouritesMenuActive,
        toggleFavouritesMenu,
        outsideClick
      }}
    >
      {children}
    </NavTogglesContext.Provider>
  );
};

export const useNavTogglesContext = () => {
  const navToggles = useContext(NavTogglesContext);
  return navToggles;
};
