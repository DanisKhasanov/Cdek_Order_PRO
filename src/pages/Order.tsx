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
import CircularProgress from "@mui/material/CircularProgress";
import ModalSettings from "../components/orderForm/order/modal";
import { Box } from "@mui/material";
import FormInputs from "../components/orderForm/order/formInputs";

const OrderForm = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const domen = import.meta.env.VITE_DOMEN;
  const [loading, setLoading] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const [contextKey, setContextKey] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleMessage = async (event: any) => {
    if (event.origin !== domen) return;
    // const message = event.data.popupParameters;
    const message = {
      id: "9a73939a-abd1-11ef-0a80-11b5004c0849",
      contextKey: "addf105b2641d84425c1cf61e69a6dc696a6ce15",
    };
    if (message) {
      setIdOrder(message.id);
      setContextKey(message.contextKey);
    }
  };

  const handleRequests = async () => {
    try {
      setLoading(true);

      if (!contextKey) {
        return;
      }

      // const accountResponse = await GetIdAccount({ contextKey });

      // const settingResponse = await GetSettingAccount(
      //   accountResponse.accountId
      // );
      // if (settingResponse.status !== "Activated") {
      //   setOpenModal(true);
      //   return;
      // }

      const settingAccount = await GetSetting("1");
      if (settingAccount) {
        localStorage.setItem("settingAccount", JSON.stringify(settingAccount));
      }

      if (idOrder) {
        const orderResponse = await GetOrderData(idOrder);
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
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress size={25} />
          <p>Загрузка...</p>
        </Box>
      ) : openModal ? (
        <ModalSettings openModal={openModal} />
      ) : (
        <FormInputs />
      )}
    </Box>
  );
};

export default OrderForm;
