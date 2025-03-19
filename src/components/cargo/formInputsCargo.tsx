import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import ButtonCustom from "./ButtonCustom";
import { Column } from "./Column";
import { Item } from "./Item";
import {
  addCargoSpace,
  updateCargoSpaces,
  removeCargoSpace,
} from "../../store/reducers/OrderReducer";
import { getCargoSizeOptions } from "./cargoSize";
import { useSnackbar } from "notistack";

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

  const handleDragEnd = (event:DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const fromPackage = packages.find((pkg) =>
      pkg.items.some((item) => item.name === active.id)
    );

    const toPackage = packages.find((pkg) => pkg.number === over.id);

    if (fromPackage && toPackage && fromPackage.number !== toPackage.number) {
      const draggedItem = fromPackage.items.find(
        (item) => item.name === active.id
      );

      if (draggedItem) {
        const updatedFromPackage = {
          ...fromPackage,
          items: fromPackage.items.filter((item) => item.name !== active.id),
        };

        const updatedToPackage = {
          ...toPackage,
          items: [...toPackage.items, draggedItem],
        };

        dispatch(
          updateCargoSpaces({
            fromPackage: updatedFromPackage,
            toPackage: updatedToPackage,
          })
        );
      }
    }
  };

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

    dispatch(addCargoSpace([newCargoSpace]));
    setNewCargoIndex(packages.length); // Устанавливаем индекс нового грузового места
    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (newCargoIndex !== null && packages[newCargoIndex]?.items.length === 0) {
      dispatch(removeCargoSpace(newCargoIndex)); // Удаляем пустое грузовое место
    }
    setOpenDialog(false);
    setNewCargoIndex(null);
  };

  const nextPage = () => {
    navigate("/tariffs");
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

      {/* Диалоговое окно */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="xl">
        <DialogTitle>
          Управление товарами в грузовых местах
          <IconButton
            color="inherit"
            onClick={closeDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              {packages.map((pkg) => (
                <Column key={pkg.number} id={pkg.number}>
                  {pkg.items.map((item) => (
                    <Item
                      key={item.ware_key}
                      name={item.name}
                      amount={item.amount}
                      weight={item.weight}
                    />
                  ))}
                </Column>
              ))}
            </div>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
