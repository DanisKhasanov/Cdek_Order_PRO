import { useEffect, useState } from "react";
import "../styles/style.css";
import { GetTariffData } from "../../../api/GetTariffData";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import UseCdekWidget from "./UseCdekWidget";
import ButtonCustom from "../cargo/ButtonCustom";
import { useNavigate } from "react-router-dom";
import { TariffProps, PickupPointProps } from "../../../props/TariffsProps";
import { ClipLoader } from "react-spinners";
import TariffActions from "./TariffAction";
import { DELIVERY_MODE } from "../../../enum/DeliveryMode";
import { RequestTemplateTariff } from "../../../api/requestTemplate/RequestTemplateTariff";
import PaymentForDelivery from "./PaymentForDelivery";

const Tariffs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [tariff, setTariff] = useState<TariffProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
  const [selectedTariffSum, setSelectedTariffSum] = useState<number | null>(
    null
  );
  const [selectedPickupPoint, setSelectedPickupPoint] =
    useState<PickupPointProps>({});

  // console.log("Доставка клиентом", isChecked);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const selectedTariffType =
    tariff.find((t) => t.tariff_code === selectedTariff)?.delivery_mode ===
    DELIVERY_MODE.POSTAMAT
      ? "POSTAMAT"
      : "PVZ";

  const { handleOpenWidget } = UseCdekWidget(
    (selected: any) => setSelectedPickupPoint(selected),
    selectedTariffType
  );

  const getTariffData = async () => {
    try {
      const data = await GetTariffData(RequestTemplateTariff(orderData));
      const filterTariffs = data.tariff_codes.filter((tariff: any) =>
        Object.values(DELIVERY_MODE).includes(tariff.delivery_mode)
      );
      setTariff(filterTariffs);
    } catch (error) {
      console.error("Ошибка при загрузке данных заказа", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTariffData();
  }, []);

  const submit = async () => {
    if (selectedTariff) {
      const selected = tariff.find((t) => t.tariff_code === selectedTariff);
      if (!selectedPickupPoint) {
        return;
      }
      dispatch(
        updateOrderForm({
          ...orderData,
          tariff_code: selected?.tariff_code,
          to_location:
            selected?.delivery_mode === DELIVERY_MODE.DOOR
              ? orderData.to_location
              : undefined,
          delivery_point:
            selected?.delivery_mode === DELIVERY_MODE.POSTAMAT ||
            selected?.delivery_mode === DELIVERY_MODE.PVZ
              ? selectedPickupPoint.address.code
              : undefined,
          delivery_point_address: selectedPickupPoint.address,
        })
      );

      navigate("/waybill");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <div className="tariffs-container">
        {loading ? (
          <div className="loading-container">
            <ClipLoader color={"#000"} loading={loading} size={25} />
            <p>Загрузка...</p>
          </div>
        ) : (
          tariff.map((tariff) => (
            <div
              className={`tariff-option ${
                selectedTariff === tariff.tariff_code ? "selected" : ""
              } ${
                selectedTariff !== null && selectedTariff !== tariff.tariff_code
                  ? "dimmed"
                  : ""
              }`}
              key={tariff.tariff_code}
              onClick={() => {
                setSelectedTariff(tariff.tariff_code);
                setSelectedTariffSum(tariff.delivery_sum + 100);
              }}
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
                <div>
                  <p>
                    <b>Сроки: </b>
                    {tariff.period_min}-{tariff.period_max} раб. дн.
                  </p>
                </div>

                <div>
                  {tariff.delivery_mode !== DELIVERY_MODE.DOOR && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="tariff-button"
                        onClick={handleOpenWidget}
                      >
                        Выбрать на карте
                      </button>
                      {!selectedPickupPoint.type &&
                        selectedTariff === tariff.tariff_code && (
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
                </div>

                <div>
                  {tariff.delivery_mode === DELIVERY_MODE.DOOR && (
                    <>
                      <p>
                        <b>Адрес: </b> {orderData.to_location.address}
                      </p>
                      {!orderData.cod && (
                        <p style={{ color: "red", fontSize: 13 }}>
                          В данном регионе отсутствует прием наложенного платежа
                          или контрагент оплатил заказ
                        </p>
                      )}

                      <TariffActions
                        selectedTariff={selectedTariff}
                        tariffCode={tariff.tariff_code}
                        deliveryName={tariff.delivery_mode}
                      />
                    </>
                  )}
                </div>
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

        <PaymentForDelivery
          selectedTariffSum={selectedTariffSum}
          isChecked={isChecked}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default Tariffs;
