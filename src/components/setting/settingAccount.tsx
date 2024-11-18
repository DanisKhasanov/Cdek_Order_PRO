import {
  Button,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBox,
  setAddressShipment,
  setBoxes,
  setDeclaredCost,
  setKeyApi,
  setNameProduct,
  setPasswordApi,
  setTypeOrder,
  setTypeShipment,
} from "../../store/reducers/SettingReducer";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { PostSettingAccount } from "../../api/api";
import { useState } from "react";
import { CustomInput, CustomInputBox } from "./inputSetting";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { textBox, textDelivery, textСonnection } from "./textTooltip";

export const SettingAccount = () => {
  const dispatch = useDispatch();
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const {
    boxes,
    type_order,
    type_shipment,
    address_shipment,
    name_product,
    declared_cost,
    key_api,
    password_api,
  } = useSelector((state: RootState) => state.setting);
  const [save, setSave] = useState(false);

  const postSettingAccount = async () => {
    await PostSettingAccount({
      key_api,
      password_api,
      boxes,
      type_order,
      type_shipment,
      address_shipment,
      name_product,
      declared_cost,
    });
  };

  const boxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof { length: string; width: string; height: string }
  ) => {
    const updatedBoxes = [...boxes];
    updatedBoxes[index] = {
      ...updatedBoxes[index],
      [field]: Number(event.target.value),
    };
    dispatch(setBoxes(updatedBoxes));
  };

  const addBox = () => {
    setSave(false);
    dispatch(
      setBoxes([
        ...boxes,
        { id: boxes.length + 1, length: 0, width: 0, height: 0 },
      ])
    );
  };

  const saveBoxes = () => {
    setSave(true);
    dispatch(setBoxes(boxes));
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
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Tooltip title={textСonnection} placement="right">
              <HelpOutlineTwoToneIcon color="primary" />
            </Tooltip>
            <Typography variant="h6">1. Подключение аккаунта</Typography>
          </Box>
          <CustomInput
            label="Ключ API"
            onChange={(e) => dispatch(setKeyApi(e.target.value))}
          />
          <CustomInput
            label="Пароль API"
            type="password"
            onChange={(e) => dispatch(setPasswordApi(e.target.value))}
          />
          <CustomInput
            select
            label="Тип заказа СДЭК"
            value={type_order}
            onChange={(e) => dispatch(setTypeOrder(e.target.value))}
          >
            <MenuItem value="internet-shop">Интернет-магазин</MenuItem>
            <MenuItem value="delivery">Доставка</MenuItem>
          </CustomInput>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <Tooltip title={textDelivery} placement="right">
              <HelpOutlineTwoToneIcon color="primary" />
            </Tooltip>
            <Typography variant="h6">2. Параметры доставки</Typography>
          </Box>
          <CustomInput
            select
            label="Тип отгрузки"
            value={type_shipment}
            onChange={(e) => dispatch(setTypeShipment(e.target.value))}
          >
            <MenuItem value="warehouse">От склада</MenuItem>
            <MenuItem value="door">От двери</MenuItem>
          </CustomInput>
          <CustomInput
            label="Адрес отгрузки"
            value={address_shipment}
            onChange={(e) => dispatch(setAddressShipment(e.target.value))}
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <Tooltip title={textBox} placement="right">
              <HelpOutlineTwoToneIcon color="primary" />
            </Tooltip>
            <Typography variant="h6">3. Размеры и описание упаковки</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            {boxes.map((box, index) => (
              <Box
                key={box.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 5,
                  mt: 2,
                }}
              >
                <CustomInputBox
                  value={box.length}
                  onChange={(e) => boxChange(e, index, "length")}
                  placeholder="длина"
                />
                <CustomInputBox
                  value={box.width}
                  onChange={(e) => boxChange(e, index, "width")}
                  placeholder="ширина"
                />
                <CustomInputBox
                  value={box.height}
                  onChange={(e) => boxChange(e, index, "height")}
                  placeholder="высота"
                />
                {boxes.length > 1 && (
                  <IconButton
                    onClick={() => {
                      dispatch(removeBox(index));
                      setSave(false);
                    }}
                  >
                    <CancelRoundedIcon color="error" />
                  </IconButton>
                )}
              </Box>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Button
                variant="contained"
                color="success"
                disabled={boxes.some(
                  (box) =>
                    box.length === 0 || box.width === 0 || box.height === 0
                )}
                sx={{ textTransform: "none" }}
                onClick={saveBoxes}
              >
                {save ? (
                  <>
                    Сохранено
                    <CheckIcon />
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
              <Button
                variant="contained"
                onClick={addBox}
                disabled={boxes.some(
                  (box) =>
                    box.length === 0 || box.width === 0 || box.height === 0
                )}
                sx={{ textTransform: "none" }}
              >
                <AddIcon />
                Добавить коробку
              </Button>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ mt: 2 }}>
            3.1. Описание товаров в грузовом месте
          </Typography>
          <CustomInput
            label="Наименование товара"
            value={name_product}
            onChange={(e) => dispatch(setNameProduct(e.target.value))}
          />
          <FormControl variant="outlined" sx={{ mt: 1 }}>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="0"
              endAdornment={<InputAdornment position="end">₽</InputAdornment>}
              onChange={(e) =>
                dispatch(setDeclaredCost(Number(e.target.value)))
              }
            />
            <FormHelperText>Объявленная стоимость за ед. товара</FormHelperText>
          </FormControl>
        </Box>
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
          onClick={postSettingAccount}
        >
          Подключить
        </Button>
      </Box>
    </>
  );
};
