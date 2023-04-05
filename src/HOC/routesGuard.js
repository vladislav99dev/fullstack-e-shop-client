import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


export const isLoggedIn = (Component) => {
  const WrapperComponent = (props) => {
    const { user } = useAuthContext();
    return user.email ? <Component {...props} /> : <Navigate to={"/"}/>;
  };
  return WrapperComponent;
};

export const isNotLoggedIn = (Component) => {
  const WrapperComponent = (props) => {
    const { user } = useAuthContext();
    return !user.email ? <Component {...props} /> : <Navigate to={"/"}/>;
  };
  return WrapperComponent;
};
