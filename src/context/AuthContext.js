import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext();

const initialValue = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  city: "",
  street: "",
  accessToken: "",
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useLocalStorage("user", initialValue);

  const login = (data) => {
    setUser(data);
  };
  const logout = () => {
    setUser(initialValue);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authState = useContext(AuthContext);
  return authState;
};
