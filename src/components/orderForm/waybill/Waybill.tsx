import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import "../styles/style.css";
import { Getshryhcode, PostOrderData } from "../../../api/PostOrderData";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { RequestTemplateWaybill } from "../../../api/requestTemplate/RequestTemplateWaybill";

const Waybill = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [response, setResponse] = useState<any>();

  const postOrderData = async () => {
    try {
      const data = await PostOrderData(RequestTemplateWaybill(orderData));
      console.log(RequestTemplateWaybill(orderData), "requestTemplate");
      console.log(data, "data");
      setResponse(data);
      setOrderCreated(true);
    } catch (error) {
      console.error("Ошибка при отправке данных на сервер:", error);
    } finally {
      setLoading(false);
    }
  };

  const getShryhCode = async (id: number) => {
    try {
      await Getshryhcode(id);
    } catch (error) {
      console.error("Ошибка при получении шрихкодов:", error);
    } finally {
    }
  };

  useEffect(() => {
    postOrderData();
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateFormatted = date.toLocaleDateString("ru-RU");
    const timeFormatted = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateFormatted} в ${timeFormatted}`;
  };

  return (
    <div className="waybill-container">
      {loading ? (
        <div className="loading-container">
          <ClipLoader color={"#000"} loading={loading} size={25} />
          <p>Загрузка...</p>
        </div>
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

          {orderCreated && (
            <>
              <div className="waybill-item">
                <span>
                  По документу создана накладная
                  <a href={response.href} title="Скачать">
                    {" "}
                    <b>{response.uuid}</b>
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
                    <b>{response.state}</b> от {formatDateTime(response.date)}
                  </u>
                </span>
              </div>

              <div className="waybill-item">
                <a href="#">
                  <span>Переход в СДЕК к заказу</span>
                </a>
              </div>

              {packages.length > 1 && (
                <div className="waybill-item">
                  <a href={"#"}>
                    <span onClick={() => getShryhCode(response.uuid)}>
                      Печати на штрихкоды
                    </span>
                  </a>
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
