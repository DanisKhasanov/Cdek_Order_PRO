import { MenuItem, Typography, Box, Tooltip } from "@mui/material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { CustomInput } from "./inputSetting";
import { useDispatch, useSelector } from "react-redux";
import {
  setKeyApi,
  setPasswordApi,
  setTokenMS,
} from "../../store/reducers/SettingReducer";
import { textСonnection } from "../../helpers/textTooltip";
import { RootState } from "../../store/store";

export const ConnectingAccount = () => {
  const dispatch = useDispatch();
  const { orderType } = useSelector((state: RootState) => state.setting);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <Tooltip title={textСonnection} placement="right">
          <HelpOutlineTwoToneIcon color="primary" />
        </Tooltip>
        <Typography variant="subtitle1">1. Подключение аккаунта</Typography>
      </Box>
      <CustomInput
        label="Идентификатор клиента (Account)"
        onChange={(e) => dispatch(setKeyApi(e.target.value))}
      />
      <CustomInput
        label="Секретный ключ (Secure password)"
        type="password"
        onChange={(e) => dispatch(setPasswordApi(e.target.value))}
      />
      <CustomInput
        label="Токен МойСклад"
        onChange={(e) => dispatch(setTokenMS(e.target.value))}
      />
      <CustomInput select label="Тип заказа СДЭК" value={orderType}>
        <MenuItem value="1" sx={{ fontSize: "14px" }}>
          Интернет-магазин
        </MenuItem>
      </CustomInput>
    </Box>
  );
};
