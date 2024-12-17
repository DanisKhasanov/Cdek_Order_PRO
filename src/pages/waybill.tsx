import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import "../components/styles/style.css";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import { connectSocket, disconnectSocket, socket } from "../api/socket";
import { Box, Container } from "@mui/material";
import CreatedWaybill from "../components/waybill/createdWaybill";
import UncreatedWaybill from "../components/waybill/uncreatedWaybill";
import { updateOrderForm } from "../store/reducers/OrderReducer";
import { PostOrderData } from "../api/api";

const Waybill = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const nameRecipient = orderData.recipient.name;
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [response, setResponse] = useState<any>();
  const [errors, setErrors] = useState<string[]>([]);
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    connectSocket();

    socket.on("connect", () => {
      setSocketId(socket.id ?? "");
    });

    if (orderData.counterParty) {
      postOrderData();
    }

    socket.on("printFormReady", (data) => {
      const { base64, mimeType, type } = data;
      printForm(base64, mimeType, type);
    });

    return () => {
      disconnectSocket();
      socket.off("connect");
      socket.off("printFormReady");
    };
  }, []);

  const postOrderData = async () => {
    try {
      const data = await PostOrderData(orderData, orderData.accountId);
      setResponse(data);
      setOrderCreated(true);
      dispatch(updateOrderForm({ ...orderData, orderCreated: true }));
    } catch (error: any) {
      setOrderCreated(false);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err: any) => err.msg));
      } else {
        setErrors([error.message || "Произошла ошибка при отправке данных"]);
      }
    } finally {
      setLoading(false);
    }
  };

  const printForm = (base64: string, mimeType: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    const date = new Date().toLocaleDateString("ru-RU");
    const fileName =
      type === "BARCODE"
        ? `Штрихкод_${nameRecipient}_${date}.pdf`
        : `Накладная_${nameRecipient}_${date}.pdf`;

    link.download = fileName;
    link.click();
    URL.revokeObjectURL(fileURL);
  };

  return (
    <Container maxWidth="md">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            marginTop: "20px",
          }}
        >
          {orderCreated && response.requests[0]?.state === "SUCCESSFUL" ? (
            <CreatedWaybill response={response} socketId={socketId} />
          ) : (
            <UncreatedWaybill response={response} errors={errors} />
          )}
        </Box>
      )}
    </Container>
  );
};

export default Waybill;
