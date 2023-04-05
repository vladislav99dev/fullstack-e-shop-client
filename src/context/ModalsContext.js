import { useReducer, useContext, createContext } from "react";

const ModalContext = createContext();

const initialModalState = {
  isSuccess: {
    value: false,
    titleMessage: "",
    descriptionMessage: "",
    buttonHandler: () => {},
    buttonName: "",
  },
  isFailed: {
    value: false,
    titleMessage: "",
    descriptionMessage: "",
    buttonHandler: () => {},
    buttonName: "",
  },
};

const reducerModalsState = (state, { type, payload }) => {
  switch (type) {
    case "setIsSuccess":
      return {
        isSuccess: {
          value: true,
          titleMessage: payload.titleMessage,
          descriptionMessage: payload.descriptionMessage,
          buttonHandler: payload.buttonHandler,
          buttonName: payload.buttonName,
        },
        isFailed: {
          value: false,
          titleMessage: "",
          descriptionMessage: "",
          buttonHandler: () => {},
          buttonName: "",
        },
      };
    case "setIsFailed":
      return {
        isSuccess: {
          value: false,
          titleMessage: "",
          descriptionMessage: "",
          buttonHandler: () => {},
          buttonName: "",
        },
        isFailed: {
          value: true,
          titleMessage: payload.titleMessage,
          descriptionMessage: payload.descriptionMessage,
          buttonHandler: payload.buttonHandler,
          buttonName: payload.buttonName,
        },
      };
    case "resetModals":
      return {
        isSuccess: {
          value: false,
          titleMessage: "",
          descriptionMessage: "",
          buttonHandler: () => {},
          buttonName: "",
        },
        isFailed: {
          value: false,
          titleMessage: "",
          descriptionMessage: "",
          buttonHandler: () => {},
          buttonName: "",
        },
      };
  }
};

export const ModalsProvider = ({ children }) => {
  const [modalState, dispatch] = useReducer(
    reducerModalsState,
    initialModalState
  );

  const setSuccessModal = (
    titleMessage,
    descriptionMessage,
    buttonHandler,
    buttonName
  ) => {
    dispatch({
      type: "setIsSuccess",
      payload: { titleMessage, descriptionMessage, buttonHandler, buttonName },
    });
  };
  const setFailedModal = (
    titleMessage,
    descriptionMessage,
    buttonHandler,
    buttonName
  ) => {
    dispatch({
      type: "setIsFailed",
      payload: { titleMessage, descriptionMessage, buttonHandler, buttonName },
    });
  };
  const resetModals = () => {
    dispatch({ type: "resetModals" });
  };

  return (
    <ModalContext.Provider
      value={{ modalState, setSuccessModal, setFailedModal, resetModals }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalsContext = () => {
  const modalState = useContext(ModalContext);
  return modalState;
};
