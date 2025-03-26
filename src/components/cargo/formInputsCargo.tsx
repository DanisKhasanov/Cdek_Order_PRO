import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import ButtonCustom from "../../helpers/ButtonCustom";
import {
  addCargoSpace,
  removeCargoSpace,
} from "../../store/reducers/OrderReducer";
import { getCargoSizeOptions } from "../../helpers/cargoSize";
import { useSnackbar } from "notistack";
import { DragAndDrop } from "./dnd/dnd";
import { CustomDialog } from "./modal/customDialog";

export const FormInputsCargo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [openDialog, setOpenDialog] = useState(false);
  const [cargoSize, setCargoSize] = useState<{
    value: string;
    label: string;
    length: number;
    width: number;
    height: number;
  } | null>(null);
  const [error, setError] = useState(false);
  const [newCargoIndex, setNewCargoIndex] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [initialSizes, setInitialSizes] = useState<{
    [key: string]: { length: number; width: number; height: number };
  }>({});

  const handleCargoSizeChange = (event: SelectChangeEvent) => {
    const selectedSize = getCargoSizeOptions().find(
      (option) => option.value === event.target.value
    );
    setCargoSize(selectedSize || null);
    setError(false);
  };

  const addCargo = () => {
    if (!cargoSize) {
      setError(true);
      enqueueSnackbar("Выберите размер коробки", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "error",
      });
      return;
    }

    const newCargoSpace = {
      number: (packages.length + 1).toString(),
      weight: 0,
      length: cargoSize.length,
      width: cargoSize.width,
      height: cargoSize.height,
      items: [],
    };

    // Сохраняем исходные размеры предыдущего грузового места
    if (packages.length > 0) {
      const previousPackage = packages[packages.length - 1];
      setInitialSizes((prev) => ({
        ...prev,
        [previousPackage.number]: {
          length: previousPackage.length,
          width: previousPackage.width,
          height: previousPackage.height,
        },
      }));
    }

    dispatch(addCargoSpace([newCargoSpace]));
    setNewCargoIndex(packages.length);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (newCargoIndex !== null && packages[newCargoIndex]?.items.length === 0) {
      dispatch(removeCargoSpace(newCargoIndex)); // Удаляем пустое грузовое место
    }
    setOpenDialog(false);
  };

  const nextPage = () => {
    if (newCargoIndex !== null && packages.length > 1) {
      const previousPackage = packages[0];
      const initialSize = initialSizes[previousPackage.number];

      if (
        initialSize &&
        previousPackage.length === initialSize.length &&
        previousPackage.width === initialSize.width &&
        previousPackage.height === initialSize.height
      ) {
        setConfirmDialog(true);
        return;
      }
    }
    navigate("/tariffs");
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    navigate("/tariffs");
  };

  const handleEdit = () => {
    setConfirmDialog(false);
  };

  return (
    <>
      <FormControl
        sx={{ mt: 1, width: "35%", backgroundColor: "#fff" }}
        size="small"
        error={error}
      >
        <InputLabel id="select-label">Размер коробки</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          label="Размер коробки"
          onChange={handleCargoSizeChange}
          value={cargoSize ? cargoSize.value : ""}
        >
          {getCargoSizeOptions().map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="buttons">
        <ButtonCustom onClick={addCargo} className="btn">
          Добавить
        </ButtonCustom>

        <ButtonCustom
          type="button"
          className="next"
          onClick={nextPage}
          disabled={packages.length === 0}
        >
          Далее
        </ButtonCustom>
      </div>

      {/* Перетаскивани товаров */}
      <DragAndDrop openDialog={openDialog} closeDialog={closeDialog} />

      {/* Подтверждение информации */}
      <CustomDialog
        open={confirmDialog}
        onClose={handleEdit}
        title="Подтверждение"
        content="Размеры Грузового места №1 не были изменены. Подтвердите информацию перед переходом далее."
        showWarningIcon
        actions={
          <>
            <Button
              onClick={handleEdit}
              variant="outlined"
              sx={{ textTransform: "none", mr: 2 }}
            >
              Изменить
            </Button>
            <Button
              onClick={closeConfirmDialog}
              color="success"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Подтвердить
            </Button>
          </>
        }
      />
    </>
  );
};
