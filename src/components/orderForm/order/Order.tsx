import { useEffect, useState, forwardRef } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import Order from "../../../api/testData"; // фейковые данные
import { RootState } from "../../../store/store";
import { validationSchema } from "./Validation";
import { GetOrderData } from "../../../api/GetOrderData";
import { AddressSuggestions } from "react-dadata";
import { StyledInput } from "../styles/StyleInputAddressOrder";
import "react-dadata/dist/react-dadata.css";

const OrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;

  const CustomInput = forwardRef((props, ref: any) => (
    <StyledInput {...props} ref={ref} />
  ));

  const getOrderData = async () => {
    try {
      const order = await GetOrderData(Order);
      dispatch(
        updateOrderForm({
          number: order.number,
          recipient: {
            name: order.recipient.name,
            phones: order.recipient.phones,
          },

          comment: order.comment,
          cod: order.cod,
          sum: order.sum,
        })
      );
    } catch (error) {
      console.error("Ошибка при загрузке данных заказа", error);
    }
  };

  useEffect(() => {
    if (!orderData.recipient.name) {
      getOrderData();
    }
  }, []);

  const onSubmit = (values: any) => {
    dispatch(updateOrderForm(values));
    navigate("/cargo");
  };

  return (
    <div className="order-form">
      <Formik
        enableReinitialize
        initialValues={orderData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="account">* Договор СДЕК:</label>
              <Field
                as="select"
                id="account"
                name="account"
                className={`form-control ${
                  errors.account && touched.account ? "error" : ""
                }`}
                placeholder={
                  errors.account && touched.account ? errors.account : ""
                }
              >
                <option value="" label="Выберите договор" hidden />
                <option value="GRM" label="ГРМ" />
                <option value="ZAR" label="ЗАР" />
              </Field>
            </div>

            <div className="form-group">
              <label htmlFor="recipient.name">* Имя получателя:</label>
              <Field
                type="text"
                id="recipient.name"
                name="recipient.name"
                className={`form-control ${
                  errors.recipient?.name && touched.recipient?.name
                    ? "error"
                    : ""
                }`}
                placeholder={
                  touched.recipient?.name && errors.recipient?.name
                    ? errors.recipient.name
                    : "Например: Иван Иванов Иванович"
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipient.phones[0].number">
                * Номер телефона:
              </label>
              <Field
                type="text"
                id="recipient.phones[0].number"
                name="recipient.phones[0].number"
                className={`form-control ${
                  errors.recipient?.phones?.[0] &&
                  touched.recipient?.phones?.[0]?.number
                    ? "error"
                    : ""
                }`}
                placeholder={
                  touched.recipient?.phones?.[0]?.number &&
                  errors.recipient?.phones?.[0]
                    ? "Номер телефона обязателен"
                    : 'Например: "+7 (999) 999-99-99"'
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="to_location.address">* Адрес получателя:</label>
              <div
                className={`form-control address ${
                  errors.to_location?.address && touched.to_location?.address
                    ? "error"
                    : ""
                }`}
              >
                <AddressSuggestions
                  token={apiKey}
                  onChange={(suggestion: any) => {
                    setFieldValue("to_location.city", suggestion.data.city);
                    setFieldValue(
                      "to_location.postal_code",
                      suggestion.data.postal_code
                    );
                    setFieldValue("to_location.address", suggestion.value);
                  }}
                  inputProps={{
                    placeholder: "Введите адрес",
                  }}
                  defaultQuery={orderData.to_location.address}
                  customInput={CustomInput}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Комментарий к заказу:</label>
              <span className="comment">{orderData.comment}</span>
            </div>

            <div style={{ color: "red" }}>
              <p style={{ marginBottom: 14 }}>* - обязательные поля</p>
            </div>

            <button className="btn" type="submit">
              Далее
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;
