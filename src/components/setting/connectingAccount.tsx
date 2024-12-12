import { MenuItem, Typography, Box , Tooltip } from "@mui/material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { CustomInput } from "./inputSetting";
import { useDispatch, useSelector } from "react-redux";
import {
  setKeyApi,
  setPasswordApi,
  setTypeOrder,
} from "../../store/reducers/SettingReducer";
import { textСonnection } from "../../helpers/textTooltip";
import { RootState } from "../../store/store";

export const ConnectingAccount = () => {
  const dispatch = useDispatch();
  const { typeOrder } = useSelector((state: RootState) => state.setting);

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
        select
        label="Тип заказа СДЭК"
        value={typeOrder}
        onChange={(e) => dispatch(setTypeOrder(e.target.value))}
      >
        <MenuItem value="internet-shop" sx={{ fontSize: "14px" }}>
          Интернет-магазин
        </MenuItem>
        <MenuItem
          value="delivery"
          sx={{
            fontSize: "14px",
          }}
        >
          Доставка
        </MenuItem>
      </CustomInput>
    </Box>
  );
};
