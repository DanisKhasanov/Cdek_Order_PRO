import {
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setAccountId } from "../../store/reducers/SettingReducer";
import { login, GetIdAccount, PostSettingAccount } from "../../api/api";
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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const contextKey = queryParams.get("contextKey");

    if (contextKey) {
      setContextKey(contextKey);
      setIsConnected(true);
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
          enqueueSnackbar("Ошибка подключения данных из МС", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "left" },
          });
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

    try {
      await PostSettingAccount(setting.accountId, setting);
      enqueueSnackbar("Данные успешно сохранены", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "left" },
      });
    } catch (error) {
      enqueueSnackbar("Ошибка сохранения данных", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "left" },
      });
      throw error;
    }
  };

  const agreement = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreementAccepted(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          overflowY: "auto",
          height: "90vh",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {isConnected ? (
          <>
            <ConnectingAccount />

            <DeliveryOptions />

            <PackagingParameters />

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAgreementAccepted}
                    onChange={agreement}
                  />
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
                sx={{
                  mt: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  width: "30%",
                }}
                disabled={!isAgreementAccepted || !isConnected}
                onClick={() => postSettingAccount()}
              >
                Подключить
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ mt: 2 }}>
            У вас нет прав доступа к этой странице.
          </Typography>
        )}
      </Box>
    </>
  );
};
