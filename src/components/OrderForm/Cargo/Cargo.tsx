import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import CashOnDelivery from "./CashOnDelivery";
import AddCargo from "./AddCargo";

const initialValues = {
  weight: "",
  size: "20х20х10",
};

const validationSchema = Yup.object().shape({
  weight: Yup.number().required("Введите вес грузового места"),
  size: Yup.string().required("Выберите размеры коробки"),
});

//TODO: передумать или вынести в Props
type ButtonProps = {
  type: any;
  onClick?: any;
  className: string;
  children: any;
};

const Button = ({ type, onClick, className, children }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const Cargo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (values: any) => {
    console.log("Cargo data", values);
  };
  return (
    <>
      <div className="cargo-form">
        <AddCargo/>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group">
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

              <div className="form-group">
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
              <div className="buttons">
                <Button type="submit" className="btn">
                  Добавить
                </Button>

                <Button
                  type="button"
                  className="next"
                  onClick={() => navigate("/tariffs")}
                >
                  Далее
                </Button>

                <CashOnDelivery />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Cargo;
