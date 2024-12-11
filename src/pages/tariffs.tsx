import { useEffect, useState } from "react";
import "../components/styles/style.css";
import { GetTariffData } from "../api/api";
import { updateOrderForm } from "../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { TariffProps, PickupPointProps } from "../props/TariffsProps";
import { DELIVERY_MODE } from "../enum/DeliveryMode";
import { RequestTemplateTariff } from "../api/requestTemplate/RequestTemplateTariff";
import UseCdekWidget from "../components/tariffs/UseCdekWidget";
import TariffToDoor from "../components/tariffs/tariffToDoor";
import ButtonCustom from "../components/cargo/ButtonCustom";
import PaymentForDelivery from "../components/tariffs/paymentForDelivery";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import { TariffDescription } from "../components/tariffs/tariffDescription";

const Tariffs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountId = import.meta.env.VITE_ACCOUNT_ID;
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

  useEffect(() => {
    if (orderData.counterParty) {
      getTariffData();
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const getTariffData = async () => {
    try {
      const data = await GetTariffData(
        RequestTemplateTariff(orderData),
        orderData.accountId
      );
      const filterTariffs = data.tariff_codes.filter((tariff: any) =>
        Object.values(DELIVERY_MODE).includes(tariff.delivery_mode)
      );
      const sortedTariffs = filterTariffs.sort(
        (a: TariffProps, b: TariffProps) => a.delivery_sum - b.delivery_sum
      );
      setTariff(sortedTariffs);
    } catch (error) {
      console.error("Ошибка при загрузке данных заказа", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ padding: 28 }}>
      <div className="tariffs-container">
        {loading ? (
          <LoadingSpinner />
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
                if (accountId === orderData.accountId) {
                  setSelectedTariffSum(tariff.delivery_sum + 100);
                } else {
                  setSelectedTariffSum(tariff.delivery_sum);
                }
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

              <TariffDescription
                tariff={tariff}
                selectedTariff={selectedTariff}
              />

              <div className="tariff-cost">
                {accountId === orderData.accountId ? (
                  <span>{(tariff.delivery_sum + 100).toFixed(2)} руб.</span>
                ) : (
                  ""
                )}
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
