import { useParams, useNavigate } from "react-router-dom";

import * as productsRequester from "../../../services/productsRequester";

import { useModalsContext } from "../../../context/ModalsContext";
import { useAuthContext } from "../../../context/AuthContext";

import isAdmin from "../../../HOC/adminRoutesGuard";

import modalMessages from "../../../HOC/modalMessages";

import AttentionModal from "../../Modals/AttentionModal";

const Delete = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { modalState, setSuccessModal, setFailedModal, resetModals } =
    useModalsContext();
  const { user } = useAuthContext();

  const deleteHandler = async () => {
    try {
      const response = await productsRequester.deleteOne(
        null,
        user.accessToken,
        productId,
        user._id
      );
      const jsonResponse = await response.json();
      if (response.status !== 200)
        throw {
          responseStatus: response.status,
          message: jsonResponse.message,
        };
      if (response.status === 200)
        return setSuccessModal(
          "Congrats!",
          jsonResponse.message,
          () => {
            modalButtonHandler()
          },
          "Go to home"
        );
    } catch (err) {
      if (err.responseStatus) return setFailedModal(err.message);
    }
  };

  function modalButtonHandler() {
    resetModals();
    navigate("/home");
  }

  return (
    <>
      {!modalState.isFailed.value && !modalState.isSuccess.value && (
        <AttentionModal
          titleMessage={"Are you sure you want to delete this item?"}
          descriptionMessage={
            "If you submit you will pernametly delete this from the database!"
          }
          buttonHandler={deleteHandler}
          buttonName={"DELETE"}
        />
      )}
    </>
  );
};

export default isAdmin(modalMessages(Delete));
