import { useEffect, useState } from "react";
import "../components/styles/style.css";
import { GetDataCity, GetTariffData } from "../api/api";
import { updateOrderForm } from "../store/reducers/OrderReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { TariffProps, PickupPointProps } from "../props/TariffsProps";
import { DELIVERY_MODE } from "../enum/DeliveryMode";
import ButtonCustom from "../components/cargo/ButtonCustom";
import PaymentForDelivery from "../components/tariffs/paymentForDelivery";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import UseCdekWidget from "../components/tariffs/UseCdekWidget";
import SelectedTariff from "../components/tariffs/tariffToDoor";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const Tariffs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const accountId = import.meta.env.VITE_ACCOUNT_ID;
  const orderData = useSelector((state: RootState) => state.orderForm);
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [tariff, setTariff] = useState<TariffProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
  const [selectedTariffSum, setSelectedTariffSum] = useState<number>(0);
  const [selectedPickupPoint, setSelectedPickupPoint] =
    useState<PickupPointProps>({});

  const { fromLocation } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );


  const getCodeCity = async () => {
    try {
      const response = await GetDataCity(
        {
          toLocation: {
            postalCode: fromLocation.postalCode,
            city: fromLocation.city,
          },
        },
        orderData.accountId
      );
      if (response) {
        dispatch(
          updateOrderForm({
            ...orderData,
            fromLocation: { ...fromLocation, code: response.code },
          })
        );
      }
    } catch (error) {
      enqueueSnackbar("Ошибка при загрузке данных города", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 5000,
        variant: "error",
      });
    }
  };

  const getTariffData = async () => {
    try {
      const data = await GetTariffData(orderData, orderData.accountId);
      const filterTariffs = data.tariff_codes.filter((tariff: any) =>
        Object.values(DELIVERY_MODE).includes(tariff.delivery_mode)
      );
      const sortedTariffs = filterTariffs.sort(
        (a: TariffProps, b: TariffProps) => a.delivery_sum - b.delivery_sum
      );
      setTariff(sortedTariffs);
    } catch (error) {
      enqueueSnackbar("Ошибка при загрузке данных заказа", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 5000,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderData.counterParty) {
      getCodeCity();
      getTariffData();
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
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

  const submit = async () => {
    if (selectedTariff) {
      const selected = tariff.find((t) => t.tariff_code === selectedTariff);
      if (!selectedPickupPoint) {
        return;
      }
      dispatch(
        updateOrderForm({
          ...orderData,
          tariffCode: selected?.tariff_code,
          toLocation:
            selected?.delivery_mode === DELIVERY_MODE.DOOR
              ? orderData.toLocation
              : undefined,
          deliveryPoint:
            selected?.delivery_mode === DELIVERY_MODE.POSTAMAT ||
            selected?.delivery_mode === DELIVERY_MODE.PVZ
              ? selectedPickupPoint.address.code
              : undefined,
          deliveryPointAddress: selectedPickupPoint.address,
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
        ) : packages.length > 0 ? (
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

              <div className="tariff-description">
                <span className="tariff-title">{tariff.tariff_name}</span>

                <p>
                  <b>Сроки: </b>
                  {tariff.period_min} - {tariff.period_max} раб.дн.
                </p>

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
                        <b>Адрес: </b> {orderData.toLocation?.address}
                      </p>

                      <SelectedTariff
                        selectedTariff={selectedTariff}
                        tariffCode={tariff.tariff_code}
                        deliveryName={tariff.delivery_mode}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="tariff-cost">
                {accountId !== orderData.accountId ? (
                  <span>{(tariff.delivery_sum + 100).toFixed(2)} руб.</span>
                ) : (
                  ""
                )}
                <p>{tariff.delivery_sum.toFixed(2)} руб.</p>
              </div>
            </div>
          ))
        ) : (
          <Typography textAlign="center" fontSize={20}>
            Сначала добавьте грузовое место
          </Typography>
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
