import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeBox, setBoxes } from "../../store/reducers/SettingReducer";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

export const SettingAccount = () => {
  const dispatch = useDispatch();
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const [typeOrder, setTypeOrder] = useState("");
  const [typeShipment, setTypeShipment] = useState("");
  const { boxes } = useSelector((state: RootState) => state.setting);
  const [save, setSave] = useState(false);
  const postData = async () => {
    const response = await fetch("/api/setting/account", {
      method: "POST",
      body: JSON.stringify({ boxes, typeOrder, typeShipment }),
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
          height: "75vh",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Подключение аккаунта
          </Typography>

          <TextField fullWidth label="Ключ API" size="small" margin="dense" />

          <TextField
            fullWidth
            margin="dense"
            label="Пароль API"
            size="small"
            type="password"
          />

          <TextField
            fullWidth
            select
            size="small"
            margin="dense"
            label="Тип заказа СДЭК"
            value={typeOrder}
            onChange={(e) => setTypeOrder(e.target.value)}
          >
            <MenuItem value="internet-shop">Интернет-магазин</MenuItem>
            <MenuItem value="delivery">Доставка</MenuItem>
          </TextField>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Параметры доставки
          </Typography>

          <TextField
            fullWidth
            select
            margin="dense"
            label="Тип отгрузки"
            size="small"
            value={typeShipment}
            onChange={(e) => setTypeShipment(e.target.value)}
          >
            <MenuItem value="warehouse">От склада</MenuItem>
            <MenuItem value="door">От двери</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Адрес отгрузки"
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Размеры и описание упаковки (Грузовое место)
          </Typography>

          <Box sx={{ mt: 1 }}>
            {boxes.map((box, index) => (
              <>
                <Box
                  key={box.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 5,
                    mt: 2,
                  }}
                >
                  <FormControl variant="outlined">
                    <OutlinedInput
                      size="small"
                      type="number"
                      placeholder="длина"
                      value={box.length || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          boxChange(e as any, index, "length");
                        }
                      }}
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">см</InputAdornment>
                      }
                    />
                  </FormControl>

                  <FormControl variant="outlined">
                    <OutlinedInput
                      size="small"
                      type="number"
                      placeholder="ширина"
                      value={box.width || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          boxChange(e as any, index, "width");
                        }
                      }}
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">см</InputAdornment>
                      }
                    />
                  </FormControl>

                  <FormControl variant="outlined">
                    <OutlinedInput
                      size="small"
                      type="number"
                      placeholder="высота"
                      value={box.height || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          boxChange(e as any, index, "height");
                        }
                      }}
                      sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                          {
                            display: "none",
                          },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">см</InputAdornment>
                      }
                    />
                  </FormControl>

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
              </>
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
          <Typography sx={{ mt: 1 }}>
            Описание товаров в грузовом месте
          </Typography>

          <TextField
            fullWidth
            margin="dense"
            label="Наименование товара"
            size="small"
          />

          <FormControl variant="outlined" sx={{ mt: 1 }}>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="0"
              endAdornment={<InputAdornment position="end">₽</InputAdornment>}
            />
            <FormHelperText>Объявленная стоимость за ед. товара</FormHelperText>
          </FormControl>
        </Box>
      </Box>

      <Box>
        <FormControlLabel
          control={
            <Checkbox checked={isAgreementAccepted} onChange={agreement} />
          }
          label="Согласен с условиями пользовательского соглашения и обработки персональных данных"
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          sx={{ mt: 2, borderRadius: 1, textTransform: "none" }}
          disabled={!isAgreementAccepted}
          onClick={postData}
        >
          Подключить
        </Button>
      </Box>
    </>
  );
};
