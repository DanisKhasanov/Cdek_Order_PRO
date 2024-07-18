import React, { useRef, useEffect, useState } from "react";
import "../Style/style.css";
import $ from "jquery";
import fakeResponse from "../../../api/fetchCalculatorTariff";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
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
          defaultLocation: orderData.city,
          from: "Казань",
          goods: [{ length: 10, width: 20, height: 20, weight: 5 }],
          hideDeliveryOptions: {
            door: true,
          },
          onReady: function () {
            $("#linkForWidjet").css("display", "inline");
          },
          onChoose: function (_type, tariff, address) {
            try {
              $('[name="chosenPost"]').val(address.name);
              $('[name="addresPost"]').val(address.address);
              $('[name="pricePost"]').val(tariff.delivery_sum);
              $('[name="timePost"]').val(
                `${tariff.period_min}-${tariff.period_max}`
              );

              console.log("Выбранный пункт выдачи:", address.name);
              console.log("Адрес пункта:", address.address);
              console.log("Стоимость доставки:", tariff.delivery_sum);
              console.log("Сроки доставки (дней):", tariff.period_max);
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
      console.log(selected);
    }
  };

  const handleChangeAddress = () => {
    dispatch(updateOrderForm({ ...orderData, address }));
    setShowAddressInput(false);
  };
  return (
    <div style={{ padding: 30 }}>
      <div className="tariffs-container">
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          tariff.map((tariff) => (
            <div className="tariff-option" key={tariff.tariff_code}>
              <div>
                <input
                  type="radio"
                  name="tariff"
                  value={tariff.tariff_code}
                  className="tariff-radio"
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
                    <button
                      className="tariff-button"
                      onClick={handleOpenWidget}
                    >
                      Выбрать на карте
                    </button>
                  )}
                {(tariff.tariff_name === "До двери" ||
                  tariff.tariff_name === "Экспресс До двери") && (
                  <>
                    <p>
                      {" "}
                      <b>Адрес: </b> {orderData.address}
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
                        <button
                          className="save-btn"
                          onClick={handleChangeAddress}
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
