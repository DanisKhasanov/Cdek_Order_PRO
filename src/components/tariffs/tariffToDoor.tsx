import { TariffActionsProps } from "../../props/TariffActionsProps";
import LiftCargo from "./liftCargo";
import { FormInputsTariffs } from "./formInputsTariffs";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const SelectedTariff = ({
  selectedTariff,
  tariffCode,
  deliveryName,
}: TariffActionsProps) => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  return (
    <div>
      {selectedTariff === tariffCode && (
        <div>
          {!orderData.cod && (
            <p style={{ color: "red", fontSize: 13 }}>
              В данном регионе отсутствует прием наложенного платежа или
              контрагент оплатил заказ
            </p>
          )}
          <LiftCargo />
          <FormInputsTariffs
            selectedTariff={selectedTariff}
            tariffCode={tariffCode}
            deliveryName={deliveryName}
          />
        </div>
      )}
    </div>
  );
};

export default SelectedTariff;
