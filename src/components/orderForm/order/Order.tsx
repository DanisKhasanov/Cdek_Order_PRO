import { useEffect, useState, forwardRef } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { RootState } from "../../../store/store";
import { validationSchema } from "./Validation";
import { GetOrderData, login } from "../../../api/api";
import { AddressSuggestions } from "react-dadata";
import { StyledInput } from "../styles/StyleInputAddressOrder";
import "react-dadata/dist/react-dadata.css";
import CircularProgress from "@mui/material/CircularProgress";



const OrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;
  const [loading, setLoading] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const CustomInput = forwardRef((props, ref: any) => (
    <StyledInput {...props} ref={ref} />
  ));
  const domen = import.meta.env.VITE_DOMEN;

  useEffect(() => {
    if (orderData.recipient.name) {
      return;
    } else {
      setLoading(true);
    }

    const handleMessage = async (event: any) => {
      console.log("Данные из event", event);
      if (event.origin !== domen) {
        return;
      }

      const message = event.data.popupParameters;

      if (message) {
        setIdOrder(message);
        console.log("id клиента:", message);
        await getOrderData(message);
      }
    };
    window.addEventListener("message", handleMessage);
    
    // const fetchData = async () => {
      
    //   await login;
    // };

    // fetchData();

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (orderData.recipient.name) return;
    if (idOrder) {
      dispatch(updateOrderForm({ ...orderData, counterparty: true }));
      getOrderData(idOrder);
    }
  }, [idOrder]);

  const getOrderData = async (idOrder: any) => {
    try {
      if (idOrder === "") return;
      setLoading(true);
      const response = await GetOrderData(idOrder);
      console.log("Результат запроса:", response);
      dispatch(
        updateOrderForm({
          number: response.number,
          recipient: {
            name: response.recipient.name,
            phones: [{ number: response.recipient.phones[0].number }],
          },
          comment: response.comment,
          cod: response.cod,
          sum: response.sum,
        })
      );
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values: any) => {
    const sellerPhone =
      values.account === "GRM"
        ? "+79272441282"
        : values.account === "ZAR"
        ? "+79393932577"
        : "";

    dispatch(
      updateOrderForm({
        ...values,
        sender: { phones: [{ number: sellerPhone }] },
      })
    );
    console.log("Данные заказа:", orderData);
    navigate("/cargo");
  };

  return (
    <div className="order-form">
      {loading ? (
        <div className="loading-container">
          <CircularProgress size={25} />
          <p>Загрузка...</p>
        </div>
      ) : (
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
                {/* <div
                  className={`form-control address ${
                    errors.recipient?.name && touched.recipient?.name
                      ? "error"
                      : ""
                  }`}
                > */}
                <Field
                  type="text"
                  id="recipient.name"
                  name="recipient.name"
                  className={`form-control  ${
                    errors.recipient?.name && touched.recipient?.name
                      ? "error"
                      : ""
                  }`}
                  placeholder={
                    touched.recipient?.name && errors.recipient?.name
                      ? errors.recipient.name
                      : "Введите имя"
                  }
                />

                {/* <FioSuggestions
                    token={apiKey}
                    onChange={(suggestion: any) => {
                      setFieldValue("recipient.name", suggestion.value);
                    }}
                    inputProps={{
                      placeholder: "Введите имя",
                    }}
                    defaultQuery={orderData.recipient.name}
                    customInput={CustomInput}
                  /> */}
                {/* </div> */}
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
                <label>Комментарий к заказу:</label>
                <span className="comment">{orderData.comment}</span>
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

              <div style={{ color: "red" }}>
                <p style={{ marginBottom: 10 }}>* - обязательные поля</p>
              </div>

              <button className="btn" type="submit">
                Далее
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default OrderForm;
