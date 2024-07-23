import  { useEffect, useState } from "react";
import "../styles/style.css";
import fakeResponse from "../../../api/fetchCalculatorTariff";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import useCdekWidget from "./useWidgetCdek";
import ButtonCustom from "../cargo/ButtonCustom";
import { useNavigate } from "react-router-dom";
interface Tariff {
  tariff_code: number;
  tariff_name: string;
  tariff_description: string;
  delivery_mode: number;
  delivery_sum: number;
  period_min: number;
  period_max: number;
}
const Tariffs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [tariff, setTariff] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<{
    delivery?: any;
    rate?: any;
    address?: any;
    type?: string;
  }>({});
  const [showWarningAddress, setShowWarningAddress] = useState(false);
  const selectedTariffType = tariff
    .find((t) => t.tariff_code === selectedTariff)
    ?.tariff_name.includes("До Постамата")
    ? "POSTAMAT"
    : "PVZ";
  const {  handleOpenWidget } = useCdekWidget(
    (selected:any) => setSelectedPickupPoint(selected),
    selectedTariffType
  );

  const getCalculatorTariff = async () => {
    //TODO: Здесь будет запрос fetchCalculatorTariff.ts который вернет тариф и сроки доставки

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const order = fakeResponse;
      // TODO: Возможно занести в state данные из fetchCalculatorTariff.ts
      setTariff(order.tariff_codes);
    } catch (error) {
      console.error("Ошибка при загрузке данных заказа", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCalculatorTariff();
  }, []);

  const handleShowAddressInput = (tariffName: string) => {
    if (tariffName === "До двери" || tariffName === "Экспресс До двери") {
      setShowAddressInput(!showAddressInput);
    }
  };

  const handleChangeAddress = () => {
    dispatch(
      updateOrderForm({
        ...orderData,
        to_location: { ...orderData.to_location, address: address },
      })
    );
    setShowAddressInput(false);
  };
  const handleRefreshTariffs = () => {
    setLoading(true);
    getCalculatorTariff();
  };

  const submit = () => {
    if (selectedTariff) {
      const selected = tariff.find((t) => t.tariff_code === selectedTariff);
      if (!selectedPickupPoint) {
        setShowWarningAddress(true);
        return;
      }
      setShowWarningAddress(false);
      navigate ("/waybill");
      dispatch(
        // updateOrderForm({...orderData, delivery_point })
      )
      console.log("Selected Tariff:", selected);
      console.log("Selected Pickup Point Details:", selectedPickupPoint);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <div className="tariffs-container">
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          tariff.map((tariff) => (
            <div
              className={`tariff-option ${
                selectedTariff === tariff.tariff_code ? "selected" : ""
              } ${selectedTariff !== null && selectedTariff !== tariff.tariff_code ? "dimmed" : ""}`}
              key={tariff.tariff_code}
              onClick={() => setSelectedTariff(tariff.tariff_code)}
            >
              <div>
                <input
                  type="radio"
                  name="tariff"
                  className="tariff-radio"
                  checked={selectedTariff === tariff.tariff_code}
                  readOnly
                />
              </div>

              <div className="tariff-description">
                <span className="tariff-title">{tariff.tariff_name}</span>
                <p>
                  <b>Сроки: </b>
                  <u>
                    {tariff.period_min}-{tariff.period_max} раб. дн.
                  </u>
                </p>
                {tariff.tariff_name !== "До двери" &&
                  tariff.tariff_name !== "Экспресс До двери" && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="tariff-button"
                        onClick={handleOpenWidget}
                      >
                        {/*TODO: Додумать логику чтобы при нажатии менялось состояние кнопки */}
                        {/* {selectedPickupPoint === selectedTariffType ? (
                          <span style={{ color: "green" }}>Выбрано</span>
                        ) : (
                          "Выбрать на карте"
                        )} */}
                        Выбрать на карте
                      </button>
                      { !selectedPickupPoint.type && (
                        <div
                          style={{
                            color: "red",
                            marginLeft: "10px",
                            fontSize: 13,
                          }}
                        >
                          Выберите пункт выдачи!
                        </div>
                      )}
                    </div>
                  )}
                {(tariff.tariff_name === "До двери" ||
                  tariff.tariff_name === "Экспресс До двери") && (
                  <>
                    <p>
                      <b>Адрес: </b> {orderData.to_location.address}
                    </p>
                    {/* TODO:Узнать как можно выяснить есть ли прием наложенного платежа */}
                    {/* <p style={{ color: "red", fontSize: 13 }}>
                      В данном регионе отсутствует прием наложенного платежа
                    </p> */}

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className={`address-button  ${selectedTariff !== null && selectedTariff !== tariff.tariff_code ? "dimmed" : ""}`}
                        onClick={() =>
                          handleShowAddressInput(tariff.tariff_name)
                        }
                      >
                        Изменить адрес
                      </button>
                      <button 
                      className={`address-button  ${selectedTariff !== null && selectedTariff !== tariff.tariff_code ? "dimmed" : ""}`}
                      >
                        Добавить комментарий
                      </button>
                    </div>

                    {showAddressInput && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Введите адрес"
                          className="address-input"
                        />

                        {/*TODO:  исправить логику для пустого адреса  */}
                        <button
                          onClick={() => {
                            if (!address) {
                              alert("Адрес не может быть пустым");
                              return;
                            }
                            handleChangeAddress();
                          }}
                          className="save-btn"
                        >
                          Сохранить
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="tariff-cost">
                <span>{(tariff.delivery_sum + 100).toFixed(2)} руб.</span>
                <p>{tariff.delivery_sum.toFixed(2)} руб.</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="buttons-tariffs">
        <ButtonCustom className="btn" onClick={submit}>
          Отправить
        </ButtonCustom>
        <ButtonCustom className="next" onClick={handleRefreshTariffs}>
          Пересчитать
        </ButtonCustom>
      </div>
    </div>
  );
};

export default Tariffs;
