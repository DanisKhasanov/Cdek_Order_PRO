import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { addCargoSpace, updateOrderForm } from "../store/reducers/OrderReducer";
import { RootState } from "../store/store";
import { CargoSizeOptions } from "../enum/CargoSize";
import { GetDataCity } from "../api/api";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import AddedCargo from "../components/cargo/AddedCargo";
import {
  initialValues,
  validationSchema,
} from "../components/cargo/Validation";
import ButtonCustom from "../components/cargo/ButtonCustom";
const Cargo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [loading, setLoading] = useState(true);
  const { name_product } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  useEffect(() => {
    if (orderData.counterParty) {
      getDataOrder();
    }
  }, []);

  const getDataOrder = async () => {
    try {
      const response = await GetDataCity({
        to_location: {
          account: orderData.account,
          postal_code: orderData.to_location.postal_code,
          city: orderData.to_location.city,
        },
      });
      const cod = orderData.cod && response.cod ? true : false;
      if (response) {
        dispatch(
          updateOrderForm({
            ...orderData,
            to_location: { ...orderData.to_location, code: response.code },
            cod: cod,
          })
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addCargo = (values: any) => {
    dispatch(
      addCargoSpace({
        weight: values.weight,
        size: values.size,
        items: {
          name: name_product,
          ware_key: "1",
          weight: values.weight,
          marking: (packages.length + 1).toString(),
          amount: 1,
          payment: {
            value: orderData.cod === false ? 0 : orderData.sum,
          },
          cost: 0,
        },
      })
    );
  };

  const submit = () => {
    navigate("/tariffs");
  };

  return (
    <Box padding={5}>
      {loading ? (
        <LoadingSpinner />
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
    </Box>
  );
};

export default Cargo;
