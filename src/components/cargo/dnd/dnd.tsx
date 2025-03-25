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
    item: PackageItem,         // Объект товара, который нужно переместить
    fromPackageId: string,    // ID исходного грузового места (откуда перемещаем)
    toPackageId: string,      // ID целевого грузового места (куда перемещаем)
    quantity: number          // Количество товара для перемещения
  ) => {
    // 1. Находим исходное и целевое грузовые места в массиве packages
    const fromPackage = packages.find((pkg) => pkg.number === fromPackageId);
    const toPackage = packages.find((pkg) => pkg.number === toPackageId);
  
    // 2. Если не нашли одно из мест - выходим из функции
    if (!fromPackage || !toPackage) return;
  
    // 3. Ищем конкретный товар в исходном месте по ware_key (уникальный ID товара)
    const itemToMove = fromPackage.items.find(
      (it) => it.ware_key === item.ware_key
    );
  
    // 4. Проверяем, что товар найден и его количество достаточно для перемещения
    if (!itemToMove || itemToMove.amount < quantity) return;
  
    // 5. Обновляем массив товаров в исходном месте:
    //    - Уменьшаем количество у перемещаемого товара
    //    - Удаляем товар, если количество стало 0
    const updatedFromItems = fromPackage.items
      .map((it) =>
        it.ware_key === item.ware_key
          ? { ...it, amount: it.amount - quantity } // Уменьшаем количество
          : it
      )
      .filter((it) => it.amount > 0); // Оставляем только товары с amount > 0
  
    // 6. Находим индекс товара в целевом месте (если такой товар уже есть)
    const existingItemIndex = toPackage.items.findIndex(
      (it) => it.ware_key === item.ware_key
    );
  
    // 7. Обновляем массив товаров в целевом месте:
    let updatedToItems;
    if (existingItemIndex >= 0) {
      // Если товар уже есть в целевом месте - увеличиваем его количество
      updatedToItems = toPackage.items.map((it, index) =>
        index === existingItemIndex
          ? { ...it, amount: it.amount + quantity }
          : it
      );
    } else {
      // Если товара нет - добавляем новый элемент с указанным количеством
      updatedToItems = [...toPackage.items, { ...item, amount: quantity }];
    }
  
    // 8. Диспатчим обновление в Redux store
    dispatch(
      updateCargoSpaces({
        fromPackage: {
          ...fromPackage, // Копируем все свойства исходного места
          items: updatedFromItems, // Обновлённый массив товаров
          weight: updatedFromItems.reduce( // Пересчитываем общий вес
            (sum, item) => sum + item.weight * item.amount,
            0
          ),
        },
        toPackage: {
          ...toPackage, // Копируем все свойства целевого места
          items: updatedToItems, // Обновлённый массив товаров
          weight: updatedToItems.reduce( // Пересчитываем общий вес
            (sum, item) => sum + item.weight * item.amount,
            0
          ),
        },
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // 1. Получаем данные о перетаскивании:
    const { active, over } = event;
    // active - информация о перетаскиваемом элементе
    // over - информация о месте, куда перетащили элемент
  
    // 2. Если не определили место, куда перетащили (over) - выходим
    if (!over) return;
  
    // 3. Находим исходное грузовое место (откуда перетащили):
    const fromPackage = packages.find((pkg) =>
      pkg.items.some((item) => item.name === active.id)
      // Ищем место, в котором есть товар с name === active.id
    );
  
    // 4. Находим целевое грузовое место (куда перетащили):
    const toPackage = packages.find((pkg) => pkg.number === over.id);
    // Ищем место с number === over.id
  
    // 5. Проверяем валидность данных:
    //    - Если не нашли места
    //    - Или если места совпадают (перетащили в то же место)
    if (!fromPackage || !toPackage || fromPackage.number === toPackage.number)
      return;
  
    // 6. Находим конкретный товар, который перетащили:
    const draggedItem = fromPackage.items.find(
      (item) => item.name === active.id
    );
    if (!draggedItem) return; // Если не нашли - выходим
  
    // 7. Проверяем количество товара:
    if (draggedItem.amount > 1) {
      // Если товара больше 1 единицы:
      // - Показываем диалог выбора количества
      setSelectedItem(draggedItem); // Запоминаем товар
      setTargetPackage(toPackage.number); // Запоминаем целевое место
      setTransferAmount(1); // Устанавливаем количество по умолчанию (1)
    } else {
      // Если товар в количестве 1 - перемещаем сразу
      moveItem(draggedItem, fromPackage.number, toPackage.number, 1);
    }
  };

  const handleTransferConfirm = () => {
    if (selectedItem && targetPackage) {
      const fromPackage = packages.find((pkg) =>
        pkg.items.some((item) => item.ware_key === selectedItem.ware_key)
      );
      if (fromPackage) {
        moveItem(
          selectedItem,
          fromPackage.number,
          targetPackage,
          transferAmount
        );
      }
    }
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
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: "flex", gap: 10 }}>
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
              sx={{ mt: 2 }}
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
