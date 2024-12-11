import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderForm } from "../store/reducers/OrderReducer";
import { RootState } from "../store/store";
import {
  GetIdAccount,
  GetOrderData,
  GetSetting,
  GetSettingAccount,
  login,
} from "../api/api";
import { Box } from "@mui/material";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import ModalSettings from "../components/order/modal";
import FormInputs from "../components/order/formInputsOrder";

const OrderForm = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const domen = import.meta.env.VITE_DOMEN;
  const [loading, setLoading] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const [contextKey, setContextKey] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleMessage = (event: any) => {
    if (event.origin !== domen) return;
    const message = event.data.popupParameters;
    // const message = {
      // id: "7222522d-b78c-11ef-0a80-114b00041f00",
      // contextKey: "751b4fdde1c039bdcb1bc1a6b14c75ad5c6eadb9",
    // };


    if (message) {
      setIdOrder(message.id);
      setContextKey(message.contextKey);
    }
  };
  const handleRequests = async () => {
    try {
      const accountResponse = await GetIdAccount({ contextKey });

      if (accountResponse.accountId) {
        dispatch(updateOrderForm({ accountId: accountResponse.accountId }));
      }

      const settingResponse = await GetSettingAccount(
        accountResponse.accountId
      );
      if (settingResponse.status !== "Activated") {
        setOpenModal(true);
        return;
      }

      const settingAccount = await GetSetting("1");
      if (settingAccount) {
        localStorage.setItem("settingAccount", JSON.stringify(settingAccount));
      }

      if (idOrder) {
        const orderResponse = await GetOrderData(
          idOrder,
          accountResponse.accountId
        );
        dispatch(
          updateOrderForm({
            number: orderResponse.number,
            recipient: {
              name: orderResponse.recipient.name,
              phones: [{ number: orderResponse.recipient.phones[0].number }],
            },
            comment: orderResponse.comment,
            cod: orderResponse.cod,
            sum: orderResponse.sum,
            counterParty: true,
          })
        );
      }
    } catch (error) {
      console.error("Ошибка выполнения запросов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderData.recipient.name) return;
    setLoading(true);
    login();
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (contextKey) {
      handleRequests();
    }
  }, [contextKey]);

  return (
    <Box padding={5}>
      {loading ? (
        <LoadingSpinner />
      ) : openModal ? (
        <ModalSettings openModal={openModal} />
      ) : (
        <FormInputs />
      )}
    </Box>
  );
};

export default OrderForm;
