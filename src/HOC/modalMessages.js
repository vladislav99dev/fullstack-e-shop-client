import { useModalsContext } from "../context/ModalsContext";
import AttentionModal from "../components/Modals/AttentionModal";
import SuccessModal from "../components/Modals/SuccessModal";

import React from "react";

const modalMessages = (Component) => {
  const WrapperComponent = (props) => {
    const {
      modalState: { isFailed, isSuccess },
    } = useModalsContext();

    if (isFailed.value)
      return (
        <>
          <Component {...props} />
          <AttentionModal
            titleMessage={isFailed.titleMessage}
            descriptionMessage={isFailed.descriptionMessage}
            buttonHandler={isFailed.buttonHandler}
            buttonName={isFailed.buttonName}
          />
        </>
      );
    if (isSuccess.value)
      return (
        <>
          <Component {...props} />
          <SuccessModal
            titleMessage={isSuccess.titleMessage}
            descriptionMessage={isSuccess.descriptionMessage}
            buttonHandler={isSuccess.buttonHandler}
            buttonName={isSuccess.buttonName}
          />
        </>
      );
    return <Component {...props} />;
  };
  return WrapperComponent;
};

export default modalMessages;
