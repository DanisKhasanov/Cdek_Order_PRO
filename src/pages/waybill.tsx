import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import "../components/styles/style.css";
import { GetBarcode, GetInvoice, PostOrderData } from "../api/api";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { RequestStatus } from "../enum/RequestStatus";
import { updateOrderForm } from "../store/reducers/OrderReducer";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import { formatDateTime } from "../helpers/formatDateTime";

const Waybill = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [response, setResponse] = useState<any>();
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const account = orderData.account;
  const name = orderData.recipient.name;
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (orderData.counterParty) {
      postOrderData();
    }
  }, []);
  const postOrderData = async () => {
    try {
      const data = await PostOrderData(orderData, orderData.accountId);
      setResponse(data);
      setOrderCreated(true);
      dispatch(updateOrderForm({ ...orderData, orderCreated: true }));
    } catch (error: any) {
      setOrderCreated(false);
      if (error.requests?.[0]?.errors) {
        setErrors(error.requests[0].errors.map((err: any) => err.message));
      } else {
        setErrors([error.message || "Произошла ошибка при отправке данных"]);
        console.error("Ошибка при отправке данных на сервер:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBarcode = async (id: number) => {
    setLoadingBarcode(true);
    try {
      await GetBarcode(id, account, name);
    } catch (error) {
      console.error("Ошибка при получении шрихкодов:", error);
    } finally {
      setLoadingBarcode(false);
    }
  };

  const getInvoice = async (id: number) => {
    setLoadingInvoice(true);
    try {
      await GetInvoice(id, account, name);
    } catch (error) {
      console.error("Ошибка при получении счета:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <div className="waybill-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="waybill-content">
          {orderCreated ? (
            <div className="order-check">
              <CheckCircleOutlineIcon
                style={{ fontSize: 60, color: "#4caf50" }}
              />
              <p className="success-message">Заказ успешно создан!</p>
            </div>
          ) : (
            <div className="order-check">
              <CloseIcon style={{ fontSize: 60, color: "red" }} />
              <p className="fail-message">Не удалось создать заказ.</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-messages">
              <p style={{ color: "red" }}>Ошибки при создании заказа:</p>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {orderCreated && (
            <>
              <div className="waybill-item">
                <span>
                  По документу создана накладная
                  <a href="#" title="Скачать">
                    {" "}
                    <b onClick={() => getInvoice(response.uuid)}>
                      {response.number}
                    </b>
                  </a>{" "}
                  от {formatDateTime(response.date)}
                </span>
              </div>
              <div className="waybill-item">
                {orderData.to_location?.address ? (
                  <>
                    <span>Накладная в город: </span>
                    <span>
                      <u>{orderData.to_location.address}</u>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Накладная в {orderData.delivery_point_address?.type}:{" "}
                    </span>
                    <span>
                      <u>
                        <b>{orderData.delivery_point_address?.city || ""}</b>,{" "}
                        {orderData.delivery_point_address.address}
                      </u>
                    </span>
                  </>
                )}
              </div>
              <div className="waybill-item">
                <span>Последний статус по накладной: </span>
                <span>
                  <u>
                    <b>
                      {
                        RequestStatus[
                          response.state as keyof typeof RequestStatus
                        ]
                      }
                    </b>{" "}
                    от {formatDateTime(response.date)}
                  </u>
                </span>
              </div>

              <div className="waybill-item">
                <a href={response.href}>
                  <span>Переход в СДЕК к заказу</span>
                </a>
              </div>

              {packages.length > 1 && (
                <div className="waybill-item">
                  {loadingBarcode ? (
                    <div className="loading-container">
                      <CircularProgress size={25} />
                      <p>Загрузка штрих-кодов...</p>
                    </div>
                  ) : (
                    <a href={"#"}>
                      <span onClick={() => getBarcode(response.uuid)}>
                        Печати на штрихкоды
                      </span>
                    </a>
                  )}
                </div>
              )}

              {loadingInvoice && (
                <div className="loading-container">
                  <CircularProgress size={25} />
                  <p>Загрузка накладной...</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Waybill;
