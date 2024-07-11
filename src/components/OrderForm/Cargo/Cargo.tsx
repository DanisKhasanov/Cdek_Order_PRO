import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AddCargo from "./AddCargo";
import { addCargoSpace } from "../../../store/reducers/CargoReducer";
import { RootState } from "../../../store/store";
import CashOnDelivery from "./CashOnDelivery";

const initialValues = {
  weight: "",
  size: "20х20х10",
};

const validationSchema = Yup.object().shape({
  weight: Yup.number().required("Введите вес грузового места"),
  size: Yup.string().required("Выберите размеры коробки"),
});

//TODO: вынести в компонент????
type ButtonProps = {
  type: any;
  onClick?: any;
  className: string;
  children: any;
};
const ButtonCustom = ({ type, onClick, className, children }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

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
    console.log("Form data", values);
  };
  return (
    <>
      <div className="cargo-form">
        <AddCargo />

        <div className="form-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div style={{ display: "flex", gap: 40 }}>
                  <div className="form-group cargo">
                    <label htmlFor="weight">Вес (кг):</label>
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
                      <option value="20x20x10" label="до 2 кг 20х20х10" />
                      <option value="30x30x15" label="от 2-5 кг 30х30х15" />
                      <option value="30x30x17" label="от 5-10 кг 30х30х17" />
                      <option value="45x30x30" label="7 и более 45х30х30" />
                    </Field>
                  </div>
                </div>

                <CashOnDelivery />

                <div className="buttons ">
                  <ButtonCustom type="submit" className="btn">
                    Добавить
                  </ButtonCustom>
                  <ButtonCustom
                    type="button"
                    className="next"
                    onClick={() => navigate("/tariffs")}
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
