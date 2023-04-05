import { useNavTogglesContext } from "../../context/NavTogglesContext";
import { useModalsContext } from "../../context/ModalsContext";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import * as userRequester from "../../services/userRequester";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import CartLayout from "./Cart/CartLayout";
import FavouritesLayout from "./Favourites/FavouritesLayout";

import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdFavorite } from "react-icons/md";
import { GiTigerHead } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { ImMenu } from "react-icons/im";
import styles from "./NavBar.module.css";
import { checkUserData } from "../../services/userRequester";

import modalMessages from "../../HOC/modalMessages";

import checkAdminToken from "../../services/checkAdminToken";

const NavBar = () => {
  const navigate = useNavigate();
  const { setFailedModal, resetModals } = useModalsContext();
  const { user, logout, login } = useAuthContext();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    toggleCartMenu,
    toggleFavouritesMenu,
    isCartMenuActive,
    isFavouritesMenuActive,
  } = useNavTogglesContext();

  useEffect(() => {
      checkAdminToken(user.accessToken, user._id)
        .then(({ response, jsonResponse }) => {
          if (response.status !== 200) {
            // console.log(user.accessToken);
            setIsAdmin(false);
          }
          if (response.status === 200) {
            setIsAdmin(true)
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [user]);

  const manageFavouritesAccess = () => {
    if (user.email) {
      resetModals();
      return toggleFavouritesMenu();
    }
    if (!user.email)
      setFailedModal(
        "You should be logged in to use this feature!",
        "",
        () => {
          console.log("hello you clicking it :D");
        },
        "Click"
      );
  };

  const cartHandler = async () => {
    toggleCartMenu(!isCartMenuActive);
    try {
      const response = await checkUserData(null, user._id);
      const jsonResponse = await response.json();
      login(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const logoutHandler = async () => {
    try {
      await userRequester.logout(null, user._id);
      logout();
      return navigate("/home");
    } catch (err) {
      return setFailedModal(
        "Something went wrong",
        err.message,
        () => resetModals(),
        "Go to Home"
      );
    }
  };

  const Icons = () => (
    <ul className={styles["nav-icons"]}>
      <MdFavorite
        onClick={manageFavouritesAccess}
        size={35}
        color={"#00df9a"}
      />
      <RiShoppingCart2Fill size={35} color={"#00df9a"} onClick={cartHandler} />
      <ImMenu
        size={35}
        color={"#00df9a"}
        className="xl:hidden"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />
      <div className="hidden">
        <AiOutlineClose size={35} color={"#00df9a"} />
      </div>
    </ul>
  );

  const PageLinks = ({ isMobileNavOpen }) => (
    <ul
      className={`${styles["nav-links"]} ${
        !isMobileNavOpen ? styles["hide"] : ""
      }`}
    >
      <li>
        <Link to={"products/all"} className={styles["nav-link"]}>
          All
        </Link>
      </li>
      {isAdmin && (
      <li>
        <Link to={"admin/orders"} className={styles["nav-link"]}>
          Orders
        </Link>
      </li>
      )}
      <li>
        <Link to="products/men" className={styles["nav-link"]}>
          Men
        </Link>
      </li>
      <li>
        <Link to={"products/women"} className={styles["nav-link"]}>
          Women
        </Link>
      </li>
      <li>
        <Link to={"products/boys"} className={styles["nav-link"]}>
          Boys
        </Link>
      </li>

      <li>
        <Link to={"products/girls"} className={styles["nav-link"]}>
          Girls
        </Link>
      </li>

      <li>
        <Link to={"products/sale"} className={styles["sale-link"]}>
          SALE
        </Link>
      </li>
      <li>
        <Link to={"products/brands"} className={styles["nav-link"]}>
          Brands
        </Link>
      </li>
      {user.email ? (
        <li className={styles["nav-user-links"]}>
          <a
            href="#"
            onClick={logoutHandler}
            className={styles["nav-logout-button"]}
          >
            Logout
          </a>
          <Link to={"users/profile"} className={styles["nav-profile-button"]}>
            Profile
          </Link>
        </li>
      ) : (
        <li className={styles["nav-user-links"]}>
          <Link to={"users/login"} className={styles["nav-login-button"]}>
            Login
          </Link>
          <Link to={"users/register"} className={styles["nav-register-button"]}>
            Register
          </Link>
        </li>
      )}
    </ul>
  );

  return (
    <>
      <nav className={styles["nav-container"]}>
        <div className={styles["logo"]}>
          <GiTigerHead size={80} color={"#00df9a"} />
        </div>
        <Icons />
        <PageLinks isMobileNavOpen={isMobileNavOpen} />
      </nav>
      {isCartMenuActive && (
        <CartLayout
          toggleCartMenu={toggleCartMenu}
          isCartMenuActive={isCartMenuActive}
        />
      )}
      {isFavouritesMenuActive && (
        <FavouritesLayout toggleFavouritesMenu={toggleFavouritesMenu} />
      )}
    </>
  );
};
export default modalMessages(NavBar);
