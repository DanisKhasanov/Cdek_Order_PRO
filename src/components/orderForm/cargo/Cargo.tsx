import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import AddedCargo from "./AddedCargo";
import { addCargoSpace } from "../../../store/reducers/CargoReducer";
import { RootState } from "../../../store/store";
import ButtonCustom from "./ButtonCustom";
import { validationSchema, initialValues } from "./Validation";
import { CargoSizeOptions } from "../../../enum/CargoSize";

const Cargo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cargoSpaces = useSelector(
    (state: RootState) => state.cargoSpace.cargoSpaces
  );

  const onSubmit = (values: any) => {
    const newId =
      cargoSpaces.length > 0 ? cargoSpaces[cargoSpaces.length - 1].id + 1 : 1;
    dispatch(addCargoSpace({ ...values, id: newId }));
  };
  return (
    <>
      <div className="cargo-form">
        <AddedCargo />

        <div className="form-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div style={{ display: "flex", gap: 40, marginTop: 5 }}>
                  <div className="form-group cargo">
                    <label htmlFor="weight">* Вес (кг):</label>
                    <Field
                      type="text"
                      id="weight"
                      name="weight"
                      className={`form-control ${
                        errors.weight && touched.weight ? "error" : ""
                      }`}
                      placeholder={
                        touched.weight && errors.weight ? errors.weight : ""
                      }
                    />
                  </div>

                  <div className="form-group cargo">
                    <label htmlFor="size">Размеры коробки:</label>
                    <Field
                      as="select"
                      id="size"
                      name="size"
                      className={`form-control ${
                        errors.size && touched.size ? "error" : ""
                      }`}
                    >
                      {CargoSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="buttons ">
                  <ButtonCustom type="submit" className="btn">
                    Добавить
                  </ButtonCustom>
                  <ButtonCustom
                    type="button"
                    className="next"
                    onClick={() => navigate("/tariffs")}
                    disabled={cargoSpaces.length === 0}
                  >
                    Далее
                  </ButtonCustom>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default Cargo;
