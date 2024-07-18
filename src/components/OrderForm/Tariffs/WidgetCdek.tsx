// import React, { useEffect, useRef } from "react";

// const WidgetCdek = () => {
//   const widgetRef = useRef();

//   useEffect(() => {
//     // Проверка, загружен ли уже скрипт Яндекс Карт
//     if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"]')) {
//       const script1 = document.createElement('script');
//       script1.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3';
//       script1.type = 'text/javascript';
//       document.body.appendChild(script1);

//       const script2 = document.createElement('script');
//       script2.src = 'https://cdn.jsdelivr.net/npm/@unocss/runtime';
//       script2.type = 'text/javascript';
//       document.body.appendChild(script2);

//       const link = document.createElement('link');
//       link.href = 'https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css';
//       link.rel = 'stylesheet';
//       document.head.appendChild(link);

//       const script3 = document.createElement('script');
//       script3.src = 'https://cdn.jsdelivr.net/npm/jquery';
//       script3.type = 'text/javascript';
//       document.body.appendChild(script3);

//       script1.onload = () => {
//         script3.onload = () => {
//           widgetRef.current = new window.CDEKWidget({
//             apiKey: 'f4e034c2-8c37-4168-8b97-99b6b3b268d7',
//             servicePath: 'http://127.0.0.1:8000/service.php',
//             popup: true,
//             defaultLocation: 'Новосибирск',
//             from: 'Казань',
//             goods: [
//               { length: 10, width: 20, height: 20, weight: 5 },
//             ],
//             hideDeliveryOptions: {
//               door: true,
//             },
//             onReady: function () {
//               $('#linkForWidjet').css('display', 'inline');
//             },
//             onChoose: function (_type, tariff, address) {
//               $('[name="chosenPost"]').val(address.name);
//               $('[name="addresPost"]').val(address.address);
//               $('[name="pricePost"]').val(tariff.delivery_sum);
//               $('[name="timePost"]').val(tariff.period_max);
//               this.close();
//             },
//           });
//         };
//       };
//     }

//     return () => {
//       // Очистка скриптов при размонтировании компонента
//       const script1 = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"]');
//       const script2 = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@unocss/runtime"]');
//       const script3 = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/jquery"]');
//       const link = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css"]');
//       if (script1) document.body.removeChild(script1);
//       if (script2) document.body.removeChild(script2);
//       if (script3) document.body.removeChild(script3);
//       if (link) document.head.removeChild(link);
//     };
//   }, []);

//   const handleOpenWidget = () => {
//     if (window.widget) {
//       window.widget.open();
//     }
//   };

//   return (
//     <div className="ml-2">
//       <p className="my-2">Виджет для оформления заказа</p>
//       <p className="my-3">
//         <button className="p-1 my-2 border-stone-500 border-2 rounded-md" onClick={handleOpenWidget}>
//           Выбрать ПВЗ
//         </button>
//       </p>
//       <div id="linkForWidjet" className="hidden">
//         <p>
//           Выбран пункт выдачи заказов:
//           <input disabled name="chosenPost" type="text" value="" />
//         </p>
//         <p>
//           Адрес пункта: <input disabled name="addresPost" type="text" value="" />
//         </p>
//         <p>
//           Стоимость доставки:
//           <input disabled name="pricePost" type="text" value="" />
//         </p>
//         <p>
//           Примерные сроки доставки (дней):
//           <input disabled name="timePost" type="text" value="" />
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WidgetCdek;






import React, { useRef, useEffect, useState } from "react";
import "../Style/style.css";
import $ from "jquery";
import fakeResponse from "../../../api/fetchCalculatorTariff";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
// import WidgetCdek from "./WidgetCdek";
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
  const widgetRef = useRef<any>();
 
 
  useEffect(() => {
    const initializeWidget = () => {
      try {
        if ((window as any).CDEKWidget) {
          widgetRef.current = new (window as any).CDEKWidget({
            apiKey: "f4e034c2-8c37-4168-8b97-99b6b3b268d7",
            servicePath: "http://127.0.0.1:8000/service.php",
            popup: true,
            defaultLocation: "Новосибирск",
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
      {/* {showWidget && <WidgetCdek />} */}
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
                  <b>Сроки: </b>
                  <u>
                    {tariff.period_min}-{tariff.period_max} раб. дн.
                  </u>
                </p>
                {tariff.tariff_name !== "До двери" &&
                  tariff.tariff_name !== "Экспресс До двери" && (
                    <button className="tariff-button" onClick={handleOpenWidget}>
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
