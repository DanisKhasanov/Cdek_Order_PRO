import React, { useRef, useEffect, useState } from "react";
import "../Style/style.css";
// import $ from "jquery";
import fakeResponse from "../../../api/fetchCalculatorTariff";

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
    //TODO: Тут будет скореее всего отображение карты
    //map();

    getCalculatorTariff();
  }, []);

  const handleShowAddressInput = (tariffName) => {
    if (tariffName === "До Двери" || tariffName === "Экспресс До Двери") {
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
    } else {
      console.log("Выберите тариф");
    }
  };
  return (
    <div style={{padding:30}}>
      <div className="tariffs-container">
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          tariff.map((tariff) => (
            <div className="tariff-option" key={tariff.tariff_code}>
              <input
                type="radio"
                name="tariff"
                value={tariff.tariff_code}
                className="tariff-radio"
                onChange={() => setSelectedTariff(tariff.tariff_code)}
              />

              <div className="tariff-description">
                <span className="tariff-title">{tariff.tariff_name}</span>
                <p>
                  Сроки: {tariff.period_min}-{tariff.period_max} раб. дн.
                </p>
                {(tariff.tariff_name !== "До Двери" &&
                  tariff.tariff_name !== "Экспресс До Двери") && (
                  <button className="tariff-button">Выбрать на карте</button>
                )}
                {(tariff.tariff_name === "До Двери" ||
                  tariff.tariff_name === "Экспресс До Двери") && (
                  <>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="address-button"
                        onClick={() =>
                          handleShowAddressInput(tariff.tariff_name)
                        }
                      >
                        Уточнить адрес
                      </button>
                      <button
                        className="address-button"
                        onClick={() =>
                          handleShowAddressInput(tariff.tariff_name)
                        }
                      >
                        Добавить комментарий
                      </button>
                    </div>
                    {showAddressInput && (
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Введите адрес"
                        className="address-input"
                      />
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