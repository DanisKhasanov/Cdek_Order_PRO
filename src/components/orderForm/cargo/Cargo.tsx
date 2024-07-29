import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import AddedCargo from "./AddedCargo";
import {
  addCargoSpace,
  updateOrderForm,
} from "../../../store/reducers/OrderReducer";
import { RootState } from "../../../store/store";
import ButtonCustom from "./ButtonCustom";
import { validationSchema, initialValues } from "./Validation";
import { CargoSizeOptions } from "../../../enum/CargoSize";
import { GetDataCity } from "../../../api/GetDataCity";
import { useEffect } from "react";

const Cargo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const orderData = useSelector((state: RootState) => state.orderForm);
  
  const getDataOrder = async () => {
    try {
      const response = await GetDataCity(orderData);
      if (response) {
        dispatch(
          updateOrderForm({
            ...orderData,
            to_location: { ...orderData.to_location, code: response.code },
            cod: response.cod,
          })
        );
      } else {
        console.log("Response is empty");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataOrder();
  }, []);

  const addCargo = (values: any) => {
    const newId = packages.length;
    dispatch(
      addCargoSpace({
        index: newId,
        weight: values.weight,
        size: values.size,
      })
    );
  };

  const submit = async () => {
    try {
      navigate("/tariffs");
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  return (
    <div className="cargo-form">
      <AddedCargo />

      <div className="form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={addCargo}
        >
          {({ errors, touched }) => (
            <Form>
              <div style={{ display: "flex", gap: 40, marginTop: 5 }}>
                <div className="form-group cargo">
                  <label htmlFor="weight">* Вес (кг):</label>
                  <Field
                    type="number"
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

              <div className="buttons">
                <ButtonCustom type="submit" className="btn">
                  Добавить
                </ButtonCustom>
                <ButtonCustom
                  type="button"
                  className="next"
                  onClick={submit}
                  disabled={packages.length === 0}
                >
                  Далее
                </ButtonCustom>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Cargo;
