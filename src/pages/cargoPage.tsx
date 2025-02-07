import { addCargoSpace, updateOrderForm } from "../store/reducers/OrderReducer";
import { GetCargoSpace, GetDataCity } from "../api/api";
import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import AddedCargo from "../components/cargo/addedCargo";
import FormInputsCargo from "../components/cargo/formInputsCargo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useSnackbar } from "notistack";

const Cargo = () => {
  const [loading, setLoading] = useState(true);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (orderData.counterParty) {
      getDataOrder();
    }
  }, []);

  const getDataOrder = async () => {
    try {
      if (orderData.toLocation.code === 0) {
        const response = await GetDataCity({
          toLocation: {
            postalCode: orderData.toLocation.postalCode,
            city: orderData.toLocation.city,
          },
        });
        const cod = orderData.cod && response.cod ? true : false;
        if (response) {
          dispatch(
            updateOrderForm({
              ...orderData,
              toLocation: { ...orderData.toLocation, code: response.code },
              cod: cod,
            })
          );
        }
      }
      if (orderData.packages.length === 0) {
        const cargoSpace = await GetCargoSpace(orderData);
        if (cargoSpace) {
          dispatch(addCargoSpace(cargoSpace));
        }
      }
    } catch (error: any) {
      if (error.response.data.message === "Общий вес заказа превышает 15 кг") {
        setErrorMessage(
          "Общий вес заказа превышает 15 кг, оформите заказ через личный кабинет СДЭК"
        );
      } else {
        enqueueSnackbar(
          "Данные не были получены, повторите ввод номера заказа",
          {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            variant: "error",
          }
        );
      }

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={5}>
      {loading ? (
        <LoadingSpinner />
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <>
          <AddedCargo />
          <FormInputsCargo />
        </>
      )}
    </Box>
  );
};

export default Cargo;
