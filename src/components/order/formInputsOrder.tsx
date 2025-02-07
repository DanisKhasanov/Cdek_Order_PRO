import { Box, Typography, FormControl, OutlinedInput } from "@mui/material";
import "react-dadata/dist/react-dadata.css";
import { CustomInput } from "../setting/inputSetting";
import { AddressSuggestions, FioSuggestions } from "react-dadata";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import {
  // setAccount,
  // setPhoneAccount,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
} from "../../store/reducers/OrderReducer";
import { TextMaskCustom } from "../setting/maskTelefon.";

const FormInputs = () => {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;
  const orderData = useSelector((state: RootState) => state.orderForm);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = () => {
    // dispatch(setAccount(orderData.name));
    // dispatch(setPhoneAccount(orderData.phones[0].number));
    if (
      orderData.recipient.name &&
      orderData.recipient.phones[0].number &&
      orderData.toLocation.address.length > 0
    ) {
      navigate("/cargo");
    } else {
      enqueueSnackbar("Заполните все поля", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "error",
      });
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={5}
        sx={{ height: "66vh" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ minWidth: 200, fontSize: "14px" }}>
            Договор СДЭК:
          </Typography>
          <CustomInput
            value={"ИП Гибадуллин Ришат Мударисович "}
            placeholder="Введите данные договора"
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ minWidth: 200, fontSize: "14px" }}>
            Имя получателя:
          </Typography>
          <FormControl fullWidth>
            <FioSuggestions
              token={apiKey}
              onChange={(suggestion: any) => {
                dispatch(setRecipientName(suggestion.value));
              }}
              inputProps={{
                placeholder: "Введите имя",
              }}
              defaultQuery={orderData.recipient.name}
              customInput={CustomInput}
            />
          </FormControl>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ minWidth: 200, fontSize: "14px" }}>
            Телефон получателя:
          </Typography>
          <FormControl fullWidth>
            <OutlinedInput
              placeholder="Введите номер телефона"
              fullWidth
              size="small"
              inputComponent={TextMaskCustom as any}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
                backgroundColor: "#fff",
              }}
              value={orderData.recipient.phones[0].number}
              onChange={(e) => dispatch(setRecipientPhone(e.target.value))}
            />
          </FormControl>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ minWidth: 200, fontSize: "14px" }}>
            Комментарий к заказу:
          </Typography>
          <CustomInput
            inputProps={{ readOnly: true }}
            multiline
            rows={4}
            placeholder="Комментарий к заказу"
            value={orderData.comment}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ minWidth: 200, fontSize: "14px" }}>
            Адрес получателя:
          </Typography>
          <FormControl fullWidth>
            <AddressSuggestions
              token={apiKey}
              onChange={(suggestion) => {
                if (suggestion) {
                  dispatch(
                    setRecipientAddress({
                      address: suggestion.value,
                      postal_code: suggestion.data.postal_code || "",
                      city: suggestion.data.city || "",
                    })
                  );
                }
              }}
              inputProps={{
                placeholder: "Введите адрес",
              }}
              defaultQuery={orderData.toLocation.address}
              count={5}
              customInput={CustomInput}
            />
          </FormControl>
        </Box>
      </Box>
      <Box>
        <button className="btn" onClick={onSubmit}>
          Далее
        </button>
      </Box>
    </Box>
  );
};

export default FormInputs;
