import {
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAccountId } from "../../store/reducers/SettingReducer";
import { login, GetIdAccount } from "../../api/api";
import { useEffect, useState } from "react";
import { ConnectingAccount } from "./connectingAccount";
import { DeliveryOptions } from "./deliveryOptions";
import { PackagingParameters } from "./packagingParameters";
import { useSnackbar } from "notistack";
import { validateForm } from "./validateFotm";
import { RootState } from "../../store/store";

export const SettingAccount = () => {
  const dispatch = useDispatch();
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const [contextKey, setContextKey] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const setting = useSelector((state: RootState) => state.setting);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const contextKey = queryParams.get("contextKey");

    if (contextKey) {
      setContextKey(contextKey);
    }
  }, []);

  useEffect(() => {
    const accountId = async () => {
      if (contextKey) {
        try {
          login();
          const response = await GetIdAccount({ contextKey });
          dispatch(setAccountId(response.accountId));
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        }
      }
    };
    accountId();
  }, [contextKey]);

  const postSettingAccount = async () => {
    const errorMessages = validateForm(setting);

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        enqueueSnackbar(message, {
          anchorOrigin: { vertical: "top", horizontal: "left" },
          variant: "error",
        });
      });
      return false;
    }

    enqueueSnackbar("Данные успешно сохранены", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "left" },
    });
    return true;
  };

  const agreement = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreementAccepted(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          overflowY: "auto",
          height: "77vh",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <ConnectingAccount />

        <DeliveryOptions />

        <PackagingParameters />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <FormControlLabel
          control={
            <Checkbox checked={isAgreementAccepted} onChange={agreement} />
          }
          label={
            <Typography sx={{ fontSize: 12, color: "gray" }}>
              Используя данное приложения, Вы принимаете условия{" "}
              <a href="#" target="_blank">
                лицензионного соглашения
              </a>{" "}
              и даете согласие на обработку персональных данных
            </Typography>
          }
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          sx={{ mt: 1, borderRadius: 1, textTransform: "none", width: "30%" }}
          disabled={!isAgreementAccepted}
          onClick={() => postSettingAccount()}
        >
          Подключить
        </Button>
      </Box>
    </>
  );
};
