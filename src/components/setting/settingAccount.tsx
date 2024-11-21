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
  setAccountId,
} from "../../store/reducers/SettingReducer";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { login, GetIdAccount } from "../../api/api";
import { useEffect, useState } from "react";
import { CustomInput, CustomInputBox } from "./inputSetting";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { textBox, textDelivery, textСonnection } from "./textTooltip";
import InputMaskTelefon from "./maskTelefon.";
import Autocomplete from "./autocomplete";

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
    accountId,
  } = useSelector((state: RootState) => state.setting);
  const [save, setSave] = useState(false);
  const [contextKey, setContextKey] = useState("");

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

  const postSettingAccount = async () => {};

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
            value={type_order}
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

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <Tooltip title={textDelivery} placement="right">
              <HelpOutlineTwoToneIcon color="primary" />
            </Tooltip>
            <Typography variant="subtitle1">2. Параметры доставки</Typography>
          </Box>

          <CustomInput
            label="Название отправителя"
            // value={}
            // onChange={}
          />

          <InputMaskTelefon />
          <Autocomplete />
          {/* <CustomInput
            label="Город отгрузки"
            value={address_shipment}
            onChange={(e) => dispatch(setAddressShipment(e.target.value))}
          /> */}
          <CustomInput
            select
            label="Тип отгрузки"
            value={type_shipment || ""}
            onChange={(e) => dispatch(setTypeShipment(e.target.value))}
          >
            <MenuItem value="warehouse" sx={{ fontSize: "14px" }}>
              От склада
            </MenuItem>
            <MenuItem value="door" sx={{ fontSize: "14px" }}>
              От двери
            </MenuItem>
          </CustomInput>

          {type_shipment === "door" && (
            <>
              <Autocomplete />

              {/* <CustomInput label="Адрес отгрузки" /> */}
              <CustomInput select label="Дата отгрузки">
                <MenuItem value="next" sx={{ fontSize: "14px" }}>
                  На следующий день
                </MenuItem>
                <MenuItem value="today" sx={{ fontSize: "14px" }}>
                  В этот же день (при заказе до 15:00)
                </MenuItem>
              </CustomInput>

              <FormHelperText>
                Время вызова курьера (c 09:00 до 22:00)
              </FormHelperText>
              <FormControl
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  "& .MuiInputBase-input": {
                    fontSize: "1.6vh",
                  },
                }}
              >
                <OutlinedInput fullWidth size="small" type="time" />
                {"-"}
                <OutlinedInput fullWidth size="small" type="time" />
              </FormControl>
              <CustomInput label="Комментарий к заказу" />
            </>
          )}
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
            <Tooltip title={textBox} placement="right">
              <HelpOutlineTwoToneIcon color="primary" />
            </Tooltip>
            <Typography variant="subtitle1">
              3. Размеры и описание упаковки
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            {boxes.map((box, index) => (
              <Box
                key={box.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  mt: 2,
                }}
              >
                <CustomInputBox
                  label="длина"
                  value={box.length}
                  onChange={(e) => boxChange(e, index, "length")}
                />
                <CustomInputBox
                  label="ширина"
                  value={box.width}
                  onChange={(e) => boxChange(e, index, "width")}
                />
                <CustomInputBox
                  label="высота"
                  value={box.height}
                  onChange={(e) => boxChange(e, index, "height")}
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
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
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
          <Typography variant="subtitle2" sx={{ mt: 2, ml: 1 }}>
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
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input::placeholder": {
                  fontSize: "14px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
              }}
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
          onClick={() => postSettingAccount()}
        >
          Подключить
        </Button>
      </Box>
    </>
  );
};
