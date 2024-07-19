import React, { useRef, useEffect, useState } from "react";
import "../styles/style.css";
// import $ from "jquery";
import fakeResponse from "../../../api/fetchCalculatorTariff";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { all } from "axios";
const Tariffs = () => {
  const [tariff, setTariff] = useState<
    {
      tariff_code: number;
      tariff_name: string;
      tariff_description: string;
      delivery_mode: number;
      delivery_sum: number;
      period_min: number;
      period_max: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const widgetRef = useRef<any>();

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
  const initializeWidget = async () => {
    try {
      if ((window as any).CDEKWidget) {
        widgetRef.current = new (window as any).CDEKWidget({
          apiKey: "f4e034c2-8c37-4168-8b97-99b6b3b268d7",
          servicePath: "http://127.0.0.1:8000/service.php",
          popup: true,
          from: "Казань",
          defaultLocation: orderData.to_location.city,
          hideFilters: {
            have_cashless: true, // скрывать кассовые операции
            have_cash: true, // скрывать наличные
            is_dressing_room: true, // скрывать способ примерки
            type: true, // скрывать типы  доставки
          },
          forceFilters: {
            // type: "PVZ", // показывать  ПВЗ
            type: "POSTAMAT", // показывать ПОСТАМАТ
          },

          hideDeliveryOptions: {
            door: true,
          },

          //TODO: возможно нужен для отображения конкретных тарифов
          // tariffs: {
          //   // Список тарифов "до ПВЗ"
          //   office: [234, 136, 138],
          //   // Список тарифов "до постамата"
          //   pickup: [235, 138, 137],
          // },

          // TODO: возможно нужен для обрабочика события, что была выбрана доставка
          // onReady: function () {},

          onChoose(delivery, rate, address) {
            try {
              setSelectedPickupPoint(true);
              console.log(delivery, rate, address);
            } catch (error) {
              console.error("Ошибка при выборе:", error);
            }
          },
          onError: function (error) {
            console.error("Ошибка виджета:", error);
          },
        });
      } else {
        console.error("CDEKWidget не загружен");
      }
    } catch (error) {
      console.error("Ошибка инициализации виджета:", error);
    }
  };

  useEffect(() => {
    initializeWidget();
    getCalculatorTariff();
  }, []);

  const handleOpenWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };
  const handleShowAddressInput = (tariffName) => {
    if (tariffName === "До двери" || tariffName === "Экспресс До двери") {
      setShowAddressInput(!showAddressInput);
    }
  };

  const handleRefreshTariffs = () => {
    setLoading(true);
    getCalculatorTariff();
  };

  const submit = () => {
    if (selectedTariff) {
      const selected = tariff.find((t) => t.tariff_code === selectedTariff);
      if (!selectedPickupPoint) {
        setShowWarning(true);
        return;
      }
      setShowWarning(false);
      console.log(selected);
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
              }`}
              key={tariff.tariff_code}
              onClick={() => setSelectedTariff(tariff.tariff_code)}
            >
              <div>
                <input
                  type="radio"
                  name="tariff"
                  value={tariff.tariff_code}
                  className="tariff-radio"
                  checked={selectedTariff === tariff.tariff_code}
                  onChange={() => setSelectedTariff(tariff.tariff_code)}
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
                        {selectedPickupPoint ? (
                          <span style={{ color: "green" }}>Выбрано</span>
                        ) : (
                          "Выбрать на карте"
                        )}
                      </button>
                      {showWarning && !selectedPickupPoint && (
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
                    {/* Узнать как можно выяснить есть ли прием наложенного платежа */}
                    <p style={{ color: "red", fontSize: 13 }}>
                      В данном регионе отсутствует прием наложенного платежа
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="address-button"
                        onClick={() =>
                          handleShowAddressInput(tariff.tariff_name)
                        }
                      >
                        Изменить адрес
                      </button>
                      <button className="address-button">
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
        <button className="btn" onClick={submit}>
          Отправить
        </button>
        <button className="next" onClick={handleRefreshTariffs}>
          Пересчитать
        </button>
      </div>
    </div>
  );
};

export default Tariffs;
