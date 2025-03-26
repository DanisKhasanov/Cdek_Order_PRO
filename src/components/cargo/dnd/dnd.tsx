import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { updateCargoSpaces } from "../../../store/reducers/OrderReducer";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { Button, TextField, Box } from "@mui/material";
import { Column } from "./Column";
import { Item } from "./Item";
import { CustomDialog } from "../modal/customDialog";
import { useState } from "react";
import { DragAndDropProps } from "../../../props/DragAndDropProps";
import { PackageItem } from "../../../props/PackageItemProps";

export const DragAndDrop = ({ openDialog, closeDialog }: DragAndDropProps) => {
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<PackageItem | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(1);
  const [targetPackage, setTargetPackage] = useState<string | null>(null);

  const moveItem = (
    itemId: string, // ID товара для перемещения
    fromPackageId: string, // ID исходного грузового места
    toPackageId: string, // ID целевого грузового места
    quantity: number // Количество для перемещения
  ) => {
    const fromPackage = packages.find((pkg) => pkg.number === fromPackageId);
    const toPackage = packages.find((pkg) => pkg.number === toPackageId);

    if (!fromPackage || !toPackage) return;

    dispatch(
      updateCargoSpaces({
        fromPackage: { ...fromPackage },
        toPackage: { ...toPackage },
        movedItemId: itemId,
        quantity,
      })
    );
  };

  const handleDragEndDrop = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromPackage = packages.find((pkg) =>
      pkg.items.some((item) => item.id === active.id)
    );
    const toPackage = packages.find((pkg) => pkg.number === over.id);

    if (!fromPackage || !toPackage || fromPackage.number === toPackage.number)
      return;

    const draggedItem = fromPackage.items.find((item) => item.id === active.id);
    if (!draggedItem) return;

    if (draggedItem.amount > 50) {
      setSelectedItem(draggedItem);
      setTargetPackage(toPackage.number);
      setTransferAmount(1);
    } else {
      moveItem(
        draggedItem.id,
        fromPackage.number,
        toPackage.number,
        draggedItem.amount
      );
    }
  };

  const handleTransferConfirm = () => {
    if (selectedItem && targetPackage) {
      const fromPackage = packages.find(
        (pkg) => pkg.items.some((item) => item.id === selectedItem.id) // Ищем по id, а не по ware_key
      );
      if (fromPackage) {
        moveItem(
          selectedItem.id, // Передаем только id товара
          fromPackage.number,
          targetPackage,
          transferAmount
        );
      }
    }
    setSelectedItem(null); // Закрываем диалог после перемещения
  };

  const handleFractionClick = (fraction: number) => {
    const amount = selectedItem?.amount || 0;
    const fractionAmount = Math.floor(amount / fraction);
    setTransferAmount(fractionAmount > 0 ? fractionAmount : 1);
  };

  return (
    <>
      <CustomDialog
        open={openDialog}
        onClose={closeDialog}
        title="Управление товарами в грузовых местах"
        maxWidth="xl"
        showCloseIcon
        content={
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEndDrop}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {packages.map((pkg) => (
                <Column key={pkg.number} id={pkg.number}>
                  {pkg.items.map((item) => (
                    <Item
                      key={item.id}
                      name={item.name}
                      amount={item.amount}
                      weight={item.weight}
                      id={item.id}
                    />
                  ))}
                </Column>
              ))}
            </div>
          </DndContext>
        }
        actions={
          <Button
            color="success"
            variant="contained"
            onClick={closeDialog}
            sx={{ textTransform: "none" }}
          >
            Сохранить
          </Button>
        }
      />

      <CustomDialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Выберите количество для перемещения"
        content={
          <>
            <TextField
              type="number"
              label={`Доступно: ${selectedItem?.amount || 0}`}
              value={transferAmount}
              onChange={(e) => {
                const value = Math.min(
                  Math.max(1, Number(e.target.value)),
                  selectedItem?.amount || 1
                );
                setTransferAmount(value);
              }}
              inputProps={{
                min: 1,
                max: selectedItem?.amount || 1,
              }}
              fullWidth
              sx={{
                mt: 2,
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={() => handleFractionClick(2)}>
                1/2
              </Button>
              <Button variant="outlined" onClick={() => handleFractionClick(3)}>
                1/3
              </Button>
              <Button
                variant="outlined"
                onClick={() => setTransferAmount(selectedItem?.amount || 1)}
              >
                Все
              </Button>
            </Box>
          </>
        }
        actions={
          <>
            <Button onClick={() => setSelectedItem(null)}>Отмена</Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleTransferConfirm();
                setSelectedItem(null);
              }}
              disabled={!transferAmount || transferAmount <= 0}
            >
              Переместить ({transferAmount} шт)
            </Button>
          </>
        }
      />
    </>
  );
};
