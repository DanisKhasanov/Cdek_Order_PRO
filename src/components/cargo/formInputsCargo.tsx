import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import ButtonCustom from "./ButtonCustom";
import { Column } from "./Column";
import { Item } from "./Item";
import {
  addCargoSpace,
  updateCargoSpaces,
} from "../../store/reducers/OrderReducer";
import { Formik, Form, Field } from "formik";
import { initialValues, validationSchema } from "./Validation";
import { getCargoSizeOptions } from "./cargoSize";

export const FormInputsCargo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDragEnd = (event) => {
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
  const addCargo = (value: any) => {

    const [length, width, height] = value.size.split("x").map(Number);

    const newCargoSpace = {
      number: (packages.length + 1).toString(),
      weight: value.weight*1000,
      length,
      width,
      height,
      items: [],
    };

    dispatch(addCargoSpace([newCargoSpace]));
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const nextPage = () => {
    navigate("/tariffs");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={addCargo}
      >
        {({ errors, touched }) => (
          <Form>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <div className="form-group cargo">
                {errors.weight && touched.weight && (
                  <div className="error-message-top">{errors.weight}</div>
                )}
                <label htmlFor="weight">Вес (кг):</label>
                <Field
                  type="number"
                  min={0}
                  step={0.01}
                  id="weight"
                  name="weight"
                  className={`form-control ${
                    errors.weight && touched.weight ? "error" : ""
                  }`}
                  placeholder="Введите вес"
                />
              </div>

              <div className="form-group cargo">
                {errors.size && touched.size && (
                  <div className="error-message-top">{errors.size}</div>
                )}
                <label htmlFor="size">Размеры коробки:</label>
                <Field
                  as="select"
                  id="size"
                  name="size"
                  className={`form-control ${
                    errors.size && touched.size ? "error" : ""
                  }`}
                >
                  {getCargoSizeOptions().map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="buttons">
              <ButtonCustom type="submit" className="btn">
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
          </Form>
        )}
      </Formik>

      {/* Диалоговое окно */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="xl">
        <DialogTitle>Управление товарами в грузовых местах</DialogTitle>
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
                    />
                  ))}
                </Column>
              ))}
            </div>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
