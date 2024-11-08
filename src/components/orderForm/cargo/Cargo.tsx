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
import { GetDataCity } from "../../../api/api";
import { useEffect, useState } from "react";
import { RequestTemplateCargo } from "../../../api/requestTemplate/RequestTemplateCargo";
import CircularProgress from "@mui/material/CircularProgress";

const Cargo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderData.counterparty) {
    getDataOrder();
    }
  }, []);

  const getDataOrder = async () => {
    try {
      const response = await GetDataCity(RequestTemplateCargo(orderData));
      const cod = orderData.cod && response.cod ? true : false;
      if (response) {
        dispatch(
          updateOrderForm({
            ...orderData,
            to_location: { ...orderData.to_location, code: response.code },
            cod: cod,
          })
        );
      } else {
        console.log("Response is empty");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCargo = (values: any) => {
    const newId = packages.length;
    dispatch(
      addCargoSpace({
        index: newId,
        weight: values.weight,
        size: values.size,
        items: {
          name: "Стеклянные флаконы",
          ware_key: "1",
          weight: values.weight,
          marking: (newId + 1).toString(),
          amount: 1,
          payment: {
            value: orderData.cod === false ? 0 : orderData.sum,
          },
          cost: 100,
        },
      })
    );
  };

  const submit = () => {
    navigate("/tariffs");
  };

  return (
    <div className="cargo-form">
      {loading || !orderData.counterparty ? (
        <div className="loading-container">
          <CircularProgress size={25} />
          <p>Загрузка...</p>
        </div>
      ) : (
        <div className="form-container">
          <AddedCargo />
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
                    marginTop: 5,
                    justifyContent: "space-between",
                  }}
                >
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
      )}
    </div>
  );
};

export default Cargo;
