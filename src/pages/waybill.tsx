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
import {
  connectSocket,
  disconnectSocket,
  socket,
} from "../api/socket";

const Waybill = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [response, setResponse] = useState<any>();
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const nameRecipient = orderData.recipient.name;
  const [errors, setErrors] = useState<string[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    connectSocket();

    socket.on("connect", () => {
      setSocketId(socket.id ?? null);
    });

    if (orderData.counterParty) {
      postOrderData();
    }

    socket.on("printFormReady", (data) => {
      const { base64, mimeType, type } = data;
      handlePrintForm(base64, mimeType, type);
    });

  return () => {
      disconnectSocket();
      socket.off("connect");
      socket.off("printFormReady");
    };
  }, []);

  const handlePrintForm = (base64: string, mimeType: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    const date = new Date().toLocaleDateString("ru-RU");
    const fileName =
      type === "BARCODE"
        ? `Штрихкод_${nameRecipient}_${date}.pdf`
        : `Накладная_${nameRecipient}_${date}.pdf`;

    link.download = fileName;
    link.click();
    URL.revokeObjectURL(fileURL);
  };

  const postOrderData = async () => {
    try {
      const data = await PostOrderData(orderData, orderData.accountId);

      setResponse(data);
      setOrderCreated(true);
      dispatch(updateOrderForm({ ...orderData, orderCreated: true }));
    } catch (error: any) {
      setOrderCreated(false);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err: any) => err.msg));
      } else {
        setErrors([error.message || "Произошла ошибка при отправке данных"]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBarcode = async (accountId: string, orderUUID: string) => {
    setLoadingBarcode(true);

    try {
      if (!socketId) {
        throw new Error("Нет подключения к сокету");
      }
      await GetBarcode(accountId, orderUUID, socketId);
    } catch (error) {
      console.error("Ошибка при получении шрихкодов:", error);
    } finally {
      setLoadingBarcode(false);
    }
  };

  const getInvoice = async (accountId: string, orderUUID: string) => {
    setLoadingInvoice(true);
    try {
      if (!socketId) {
        throw new Error("Нет подключения к сокету");
      }
      await GetInvoice(accountId, orderUUID, socketId);
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
          {orderCreated && response.requests[0].state === "SUCCESSFUL" ? (
            <div className="order-check">
              <CheckCircleOutlineIcon
                style={{ fontSize: 60, color: "#4caf50" }}
              />
              <p className="success-message">Заказ успешно создан!</p>

              <div className="waybill-item">
                <span>
                  По документу создана накладная
                  <a href="#" title="Скачать">
                    {" "}
                    <b onClick={() => getInvoice(orderData.accountId, response.uuid)}>
                      {response.number}
                    </b>
                  </a>{" "}
                  от {formatDateTime(response.date)}
                </span>
              </div>

              <div className="waybill-item">
                {orderData.toLocation?.address ? (
                  <>
                    <span>Накладная в город: </span>
                    <span>
                      <u>{orderData.toLocation.address}</u>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Накладная в {orderData.deliveryPointAddress?.type}:{" "}
                    </span>
                    <span>
                      <u>
                        <b>{orderData.deliveryPointAddress?.city || ""}</b>,{" "}
                        {orderData.deliveryPointAddress?.address}
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
                          response.requests[0]
                            .state as keyof typeof RequestStatus
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
                      <span
                        onClick={() =>
                          getBarcode(orderData.accountId, response.uuid)
                        }
                      >
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
            </div>
          )
          : (
            <div className="order-check">
              <CloseIcon style={{ fontSize: 60, color: "red" }} />
              <p className="fail-message">Не удалось создать заказ</p>

              {response?.requests?.[0]?.errors && (
                <div className="error-messages">
                  <ul>
                    {response.requests[0].errors.map((error: any) => (
                      <li key={error.code}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {errors.length > 0 && (
                <div className="error-messages">
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Waybill;
