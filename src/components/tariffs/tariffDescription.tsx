import { DELIVERY_MODE } from "../../enum/DeliveryMode";
import { useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../store/store";
import UseCdekWidget from "./UseCdekWidget";
import TariffToDoor from "./tariffToDoor";
import { PickupPointProps } from "../../props/TariffsProps";

interface TariffDescriptionProps {
  tariff: {
    tariff_code: number;
    tariff_name: string;
    delivery_mode: DELIVERY_MODE;
    period_min: number;
    period_max: number;
    delivery_sum: number;
  };
  selectedTariff: number | null;
}

export const TariffDescription = ({
  tariff,
  selectedTariff,
}: TariffDescriptionProps) => {
  const orderData = useSelector((state: RootState) => state.orderForm);

  const [selectedPickupPoint, setSelectedPickupPoint] =
    useState<PickupPointProps>({});

  const selectedTariffType =
    tariff.delivery_mode === DELIVERY_MODE.POSTAMAT ? "POSTAMAT" : "PVZ";

  const { handleOpenWidget } = UseCdekWidget(
    (selected: any) => setSelectedPickupPoint(selected),
    selectedTariffType
  );

  return (
    <div className="tariff-description">
      <span className="tariff-title">{tariff.tariff_name}</span>

      <p>
        <b>Сроки: </b>
        {tariff.period_min} - {tariff.period_max} раб.дн.
      </p>

      <div>
        {tariff.delivery_mode !== DELIVERY_MODE.DOOR && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="tariff-button" onClick={handleOpenWidget}>
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
      

            <TariffToDoor
              selectedTariff={selectedTariff}
              tariffCode={tariff.tariff_code}
              deliveryName={tariff.delivery_mode}
            />
          </>
        )}
      </div>
    </div>
  );
};
