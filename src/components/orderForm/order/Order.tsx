import { useEffect, useState, forwardRef } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrderForm,
  setAccount,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
} from "../../../store/reducers/OrderReducer";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { RootState } from "../../../store/store";
import { validationSchema } from "./Validation";
import {
  GetIdAccount,
  GetOrderData,
  GetSetting,
  GetSettingAccount,
  login,
} from "../../../api/api";
import { AddressSuggestions, FioSuggestions } from "react-dadata";
import { StyledInput } from "../styles/StyleInputAddressOrder";
import "react-dadata/dist/react-dadata.css";
import CircularProgress from "@mui/material/CircularProgress";
import ModalSettings from "./modal";
import { TextMaskCustom } from "../../setting/maskTelefon.";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { CustomInput } from "../../setting/inputSetting";

const OrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const domen = import.meta.env.VITE_DOMEN;
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;
  const [loading, setLoading] = useState(false);
  const [idOrder, setIdOrder] = useState("");
  const [contextKey, setContextKey] = useState("");
  const [openModal, setOpenModal] = useState(false);
  // const CustomInput = forwardRef((props, ref: any) => (
  //   <StyledInput {...props} ref={ref} />
  // ));

  const handleMessage = async (event: any) => {
    if (event.origin !== domen) return;
    // const message = event.data.popupParameters;
    const message = {
      id: "9a73939a-abd1-11ef-0a80-11b5004c0849",
      contextKey: "addf105b2641d84425c1cf61e69a6dc696a6ce15",
    };
    if (message) {
      setIdOrder(message.id);
      setContextKey(message.contextKey);
    }
  };

  const handleRequests = async () => {
    try {
      setLoading(true);

      if (!contextKey) {
        return;
      }

      // const accountResponse = await GetIdAccount({ contextKey });

      // const settingResponse = await GetSettingAccount(
      //   accountResponse.accountId
      // );
      // if (settingResponse.status !== "Activated") {
      //   setOpenModal(true);
      //   return;
      // }

      const settingAccount = await GetSetting("1");
      if (settingAccount) {
        localStorage.setItem("settingAccount", JSON.stringify(settingAccount));
      }

      if (idOrder) {
        
        const orderResponse = await GetOrderData(idOrder);
        dispatch(
          updateOrderForm({
            number: orderResponse.number,
            recipient: {
              name: orderResponse.recipient.name,
              phones: [{ number: orderResponse.recipient.phones[0].number }],
            },
            comment: orderResponse.comment,
            cod: orderResponse.cod,
            sum: orderResponse.sum,
            counterparty: true,
          })
        );
      }
    } catch (error) {
      console.error("Ошибка выполнения запросов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(orderData.recipient.name) return;
    login();
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (contextKey) {
      handleRequests();
    }
  }, [contextKey]);

  const onSubmit = (values: any) => {
    console.log("values", values);
    const sellerPhone = "";
    dispatch(
      updateOrderForm({
        ...values,
        sender: { phones: [{ number: sellerPhone }] },
      })
    );
    navigate("/cargo");
  };

  return (
    <div className="order-form">
      {loading ? (
        <div className="loading-container">
          <CircularProgress size={25} />
          <p>Загрузка...</p>
        </div>
      ) : openModal ? (
        <ModalSettings openModal={openModal} />
      ) : (
        // <Formik
        //   enableReinitialize
        //   initialValues={orderData}
        //   validationSchema={validationSchema}
        //   onSubmit={onSubmit}
        // >
        //   {({ errors, touched, setFieldValue }) => (
        //     <Form>
        //       <div className="form-group">
        //         <label htmlFor="account">Договор СДЕК:</label>
        //         <Field
        //           as="select"
        //           name="account"
        //           className={`form-control ${
        //             errors.account && touched.account ? "error" : ""
        //           }`}
        //         >
        //           <option value="GRM" label="ГРМ" />
        //           <option value="ZAR" label="ЗАР" />
        //         </Field>
        //       </div>

        //       <div className="form-group">
        //         <label htmlFor="recipient.name">Имя получателя:</label>
        //         <div className="form-control address">
        //           <Field name="recipient.name">
        //             {({ field }: any) => (
        //               <FioSuggestions
        //                 token={apiKey}
        //               onChange={(suggestion: any) => {
        //                 setFieldValue("recipient.name", suggestion.value);
        //               }}
        //               inputProps={{
        //                 placeholder: "Введите имя",
        //               }}
        //               defaultQuery={orderData.recipient.name}
        //                 customInput={CustomInput}
        //               />
        //             )}
        //           </Field>
        //         </div>
        //       </div>

        //       <div className="form-group">
        //         <label htmlFor="recipient.phones[0].number">
        //           Номер телефона:
        //         </label>
        //         <Field
        //           type="tel"
        //           id="recipient.phones[0].number"
        //           name="recipient.phones[0].number"
        //           className={`form-control ${
        //             errors.recipient?.phones?.[0]?.toString &&
        //             touched.recipient?.phones?.[0]?.number
        //               ? "error"
        //               : ""
        //           }`}
        //           placeholder="Например: +7 (999) 999-99-99"
        //         />
        //       </div>

        //       <div className="form-group">
        //         <label>Комментарий к заказу:</label>
        //         <span className="comment">{orderData.comment}</span>
        //       </div>

        //       <div className="form-group">
        //         <label htmlFor="to_location.address">Адрес получателя:</label>
        //         <div className="form-control address">
        //           <AddressSuggestions
        //             token={apiKey}
        //             onChange={(suggestion: any) => {
        //               setFieldValue("to_location.city", suggestion.data.city);
        //               setFieldValue(
        //                 "to_location.postal_code",
        //                 suggestion.data.postal_code
        //               );
        //               setFieldValue("to_location.address", suggestion.value);
        //             }}
        //             inputProps={{
        //               placeholder: "Введите адрес",
        //             }}
        //             defaultQuery={orderData.to_location.address}
        //             customInput={CustomInput}
        //           />
        //         </div>
        //       </div>

        //       <button className="btn" type="submit">
        //         Далее
        //       </button>
        //     </Form>
        //   )}
        // </Formik>
        <>
          <Box
            display="flex"
            flexDirection="column"
            gap={5}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              gap={5}
            >
              <CustomInput
                select
                value={orderData.account}
                onChange={(e) => dispatch(setAccount(e.target.value))}
              >
                <MenuItem value="GRM" sx={{ fontSize: "14px" }}>
                  ГРМ
                </MenuItem>
                <MenuItem
                  value="ZAR"
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  ЗАР
                </MenuItem>
              </CustomInput>
            </Box>

            <FioSuggestions
              token={apiKey}
              onChange={(suggestion: any) => {
                dispatch(setRecipientName(suggestion.value));
              }}
              inputProps={{
                placeholder: "Введите имя",
              }}
              defaultQuery={orderData.recipient.name}
              customInput={CustomInput}
            />

            <FormControl>
              <OutlinedInput
                placeholder="Введите номер телефона"
                fullWidth
                size="small"
                inputComponent={TextMaskCustom as any}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                  backgroundColor: "#fff",
                }}
                value={orderData.recipient.phones[0].number}
                onChange={(e) => dispatch(setRecipientPhone(e.target.value))}
              />
            </FormControl>

            {/* TODO: Комментарий к заказу возможно поменять на другие поля */}
            <CustomInput
              inputProps={{ readOnly: true }}
              multiline
              rows={4}
              placeholder="Комментарий к заказу"
              onChange={() => {}}
            />

            <AddressSuggestions
              token={apiKey}
              onChange={(suggestion) => {
                if (suggestion) {
                  console.log("suggestion", suggestion);
                  dispatch(
                    setRecipientAddress({
                      address: suggestion.value,
                      postal_code: suggestion.data.postal_code || "",
                      city: suggestion.data.city || "",
                    })
                  );
                }
              }}
              inputProps={{
                placeholder: "Введите адрес",
              }}
              defaultQuery={orderData.to_location.address}
              customInput={CustomInput}
            />

            <button className="btn" onClick={onSubmit}>
              Далее
            </button>
          </Box>
        </>
      )}
    </div>
  );
};

export default OrderForm;
