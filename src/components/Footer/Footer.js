import { useReducer } from "react";

import { SiGithub, SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";
import { MdLocationOn } from "react-icons/md";
import styles from "./Footer.module.css";

import DesktopCard from "./DesktopCard";

const initialTogglesState = {
  hetHelp: false,
  about: false,
  apps: false,
};

const reducerToggleState = (state, action) => {
  switch (action.type) {
    case "getHelp":
      return {
        getHelp: !state.getHelp,
        about: false,
        apps: false,
      };
    case "about":
      return {
        getHelp: false,
        about: !state.about,
        apps: false,
      };
    case "apps":
      return {
        getHelp: false,
        about: false,
        apps: !state.apps,
      };
    default:
      break;
  }
};

const Footer = () => {
  const [togglesState, dispatch] = useReducer(
    reducerToggleState,
    initialTogglesState
  );

  const toggler = (type) => {
    dispatch({ type: type });
  };

  return (
    <div className={styles.container}>
      <div>
        <ul className={styles.firstCol}>
          <li>FIND A STORE</li>
          <li>NIKE JOURNAL</li>
          <li>BECOME A MEMBER</li>
          <li>FEEDBACK</li>
          <li>PROMO CODES</li>
        </ul>
      </div>

      <DesktopCard
        titleName={"GET HELP"}
        services={[
          "Order Status",
          "Shipping and Delivery",
          "Returns",
          "Payment Options",
          "Contact us",
        ]}
        state={togglesState.getHelp}
        clickHandler={toggler.bind(null, "getHelp")}
      />
      <DesktopCard
        titleName={"ABOUT NIKE"}
        services={["News", "Carrers", "Investors", "Sustainability"]}
        state={togglesState.about}
        clickHandler={toggler.bind(null, "about")}
      />
      <DesktopCard
        titleName={"NIKE APPS"}
        services={["Nike App", "Nike Run Club", "Nike Training Club", "SNKRS"]}
        state={togglesState.apps}
        clickHandler={toggler.bind(null, "apps")}
      />
      <div className={styles.icons}>
        <a href="https://github.com/vladislav99dev" target="_blank">
          <SiGithub color={"#00df9a"} size={30} />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100058096826543"
          target="_blank"
        >
          <SiFacebook color={"#00df9a"} size={30} />
        </a>
        <a href="https://www.instagram.com/vladislavdorovski2/" target="_blank">
          <SiInstagram color={"#00df9a"} size={30} />
        </a>
        <a
          href="https://www.linkedin.com/in/vladislav-dorovski-7bb854252/"
          target="_blank"
        >
          <SiLinkedin color={"#00df9a"} size={30} />
        </a>
      </div>

      <div className={styles["location-copyright"]}>
        <div className="flex">
          <MdLocationOn color={"#00df9a"} size={25} />
          <p>Pleven, Bulgaria</p>
        </div>
        <p>&copy; 2022 SUPREME FASHION SHOP, Inc.All Rights Reserved</p>
      </div>

      <div className={styles.terms}>
        <ul>
          <li>Terms of Use</li>
          <li>Terms of Sale</li>
          <li>Company Details</li>
          <li>Privacy &#38; Cookie Policy</li>
          <li>Cookie Settings</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;