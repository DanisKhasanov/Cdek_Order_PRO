import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import "../styles/style.css";
import { PostOrderData } from "../../../api/PostOrderData";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader"; 
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from '@mui/icons-material/Close';
const Waybill = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  const postOrderData = async () => {
    try {
      await PostOrderData(orderData);
      setOrderCreated(true);
    } catch (error) {
      console.error("Ошибка при отправке данных на сервер:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    postOrderData();
  }, []);

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
              <CheckCircleOutlineIcon style={{ fontSize: 60 , color: "4caf50"}} />
              <p className="success-message">Заказ успешно создан!</p>
            </div>
          ) : (
            <div className="order-check">
              <CloseIcon style={{ fontSize: 60 , color: "red"}} />
              <p className="fail-message">Не удалось создать заказ.</p>
            </div>
          )}

          {orderCreated && (
            <>
              <div className="waybill-item">
                <span>
                  По документу создана накладная{" "}
                  <b>
                    <a href="">12345</a>
                  </b>{" "}
                  от {new Date().toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="waybill-item">
              {orderData.to_location?.address ? (
                  <>
                    <span>Накладная в город: </span>
                    <span>
                      <u>
                        {orderData.to_location.address}
                      </u>
                    </span>
                  </>
                ) : (
                  <>
                    <span>Накладная в {orderData.delivery_point_address?.type}: </span>
                    <span>
                      <u>
                        <b>{orderData.delivery_point_address?.city || ""}</b>,{" "} {orderData.delivery_point_address.address}
                      </u>
                    </span>
                  </>
                )}
              </div>
              <div className="waybill-item">
                <span>Последний статус по накладной: </span>
                <span>
                  <u>
                    <b>Создан</b> от {new Date().toLocaleDateString("ru-RU")} в
                    15:23
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
                  <a href="#">
                    <span>Печати на штрихкоды</span>
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
