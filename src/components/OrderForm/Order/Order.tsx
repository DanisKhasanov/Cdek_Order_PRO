import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../Style/style.css";
// import { fetchOrderData } from "../../../api/fetchOrderData";
import Order from "../../../api/testData"; // фейк данные
import { RootState } from "../../../store/store";

const validationSchema = Yup.object({
  recipientName: Yup.string().required("Имя получателя обязательно"),
  phoneNumber: Yup.number().required("Номер телефона обязателен"),
  city: Yup.string().required("Город обязателен"),
  address: Yup.string().required("Адрес обязателен"),
});

const OrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);

  useEffect(() => {
    if (!orderData.recipientName) {
      const getOrderData = async () => {
        try {
          // TODO: ТУТ будет запрос на получение данных и далее записываем все в store (либо в Api сразу пишу slice на получение данных)

          const order = Order;

          dispatch(
            updateOrderForm({
              contract: "ГРМ",
              recipientName: order.recipient.name,
              phoneNumber: order.recipient.phones[0].number,
              city: order.to_location.city,
              address: order.to_location.address,
            })
          );
        } catch (error) {
          console.error("Ошибка при загрузке данных заказа", error);
        }
      };

      getOrderData();
    }
  }, [dispatch, orderData]);

  const onSubmit = (values: any) => {
    dispatch(updateOrderForm(values));
    console.log("Form data", values);
    navigate("/cargo");
  };

  //TODO : Проверить ТЗ на "Город получателя"

  return (
    <div className="order-form">
      <Formik
        enableReinitialize
        initialValues={orderData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="contract">Договор СДЕК:</label>
              <Field
                as="select"
                id="contract"
                name="contract"
                className={`form-control ${
                  errors.contract && touched.contract ? "error" : ""
                }`}
              >
                <option value="ГРМ" label="ГРМ" />
                <option value="ЗАР" label="ЗАР" />
              </Field>
            </div>

            <div className="form-group">
              <label htmlFor="recipientName">* Имя получателя:</label>
              <Field
                type="text"
                id="recipientName"
                name="recipientName"
                className={`form-control ${
                  errors.recipientName && touched.recipientName ? "error" : ""
                }`}
                placeholder={
                  touched.recipientName && errors.recipientName
                    ? errors.recipientName
                    : ""
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">* Номер телефона:</label>
              <Field
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className={`form-control ${
                  errors.phoneNumber && touched.phoneNumber ? "error" : ""
                }`}
                placeholder={
                  touched.phoneNumber && errors.phoneNumber
                    ? errors.phoneNumber
                    : ""
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">* Город получателя:</label>
              <Field
                type="text"
                id="city"
                name="city"
                className={`form-control ${
                  errors.city && touched.city ? "error" : ""
                }`}
                placeholder={touched.city && errors.city ? errors.city : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">* Адрес получателя:</label>
              <Field
                type="text"
                id="address"
                name="address"
                className={`form-control ${
                  errors.address && touched.address ? "error" : ""
                }`}
                placeholder={
                  touched.address && errors.address ? errors.address : ""
                }
              />
            </div>

            <div style={{marginBottom: 55, color: "red"}}>
              <p>* - обязательные поля</p>
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
