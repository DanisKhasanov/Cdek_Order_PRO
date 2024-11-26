import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import { CustomInput, CustomInputBox } from "./inputSetting";
import { textBox } from "./textTooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  removeBox,
  setDeclaredCost,
  setNameProduct,
} from "../../store/reducers/SettingReducer";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import { useState } from "react";
import { setBoxes } from "../../store/reducers/SettingReducer";

export const PackagingParameters = () => {
  const { boxes, name_product } = useSelector(
    (state: RootState) => state.setting
  );
  const dispatch = useDispatch();
  const [save, setSave] = useState(false);

  const boxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof {
      weight: string;
      length: string;
      width: string;
      height: string;
    }
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
        { id: boxes.length + 1, weight: 0, length: 0, width: 0, height: 0 },
      ])
    );
  };

  const saveBoxes = () => {
    setSave(true);
    dispatch(setBoxes(boxes));
  };

  return (
    <>
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
                gap: 2,
                mt: 2,
              }}
            >
              <CustomInputBox
                label="вес"
                value={box.weight || 0}
                adorment={"кг."}
                onChange={(e) => boxChange(e, index, "weight")}
              />
              <CustomInputBox
                label="длина"
                value={box.length || 0}
                onChange={(e) => boxChange(e, index, "length")}
              />

              <CustomInputBox
                label="ширина"
                value={box.width || 0}
                onChange={(e) => boxChange(e, index, "width")}
              />
              <CustomInputBox
                label="высота"
                value={box.height || 0}
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              disabled={boxes.some(
                (box) => box.length === 0 || box.width === 0 || box.height === 0
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
                  box.weight === 0 ||
                  box.length === 0 ||
                  box.width === 0 ||
                  box.height === 0
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
          <InputLabel
            sx={{
              fontSize: "14px",
              color: "#a2a2a2",
              mt: "-7px",
              "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -3px) scale(0.75)",
              },
            }}
          >
            Объявленная стоимость
          </InputLabel>
          <OutlinedInput
            size="small"
            label="Объявленная стоимость"
            type="number"
            endAdornment={<InputAdornment position="end">₽</InputAdornment>}
            onChange={(e) => dispatch(setDeclaredCost(Number(e.target.value)))}
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
        </FormControl>
      </Box>
    </>
  );
};
