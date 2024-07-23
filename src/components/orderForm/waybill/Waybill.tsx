import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import "../styles/style.css";

const Waybill = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const packages = useSelector((state: RootState) => state.orderForm.packages);


  return (
    <div className="waybill-container">
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
        <span>Накладная в город: </span>
        <span>
          <u>
            {" "}
            <b>{orderData.to_location.city}</b>, {orderData.to_location.address}
          </u>
        </span>
      </div>
      <div className="waybill-item">
        <span>Последний статус по накладной: </span>
        <span>
          <u>
            <b>Создан</b> от {new Date().toLocaleDateString("ru-RU")} в 15:23
          </u>
        </span>
      </div>

      <div className="waybill-item">
        <a href="">
          <span>Переход в СДЕК к заказу</span>
        </a>
      </div>

      {packages.length > 1 && (
        <div className="waybill-item">
          <a href="">
            <span>Печати на штрихкоды</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Waybill;
