import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Box } from "@mui/material";
import FormInputs from "../components/order/formInputsOrder";
import { useSnackbar } from "notistack";

const OrderForm = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!orderData.recipient.name) {
      enqueueSnackbar("Данные не были получены, повторите ввод номера заказа", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "error",
      });
    }
  }, []);

  return (
    <Box padding={5}>
      <FormInputs />
    </Box>
  );
};

export default OrderForm;
