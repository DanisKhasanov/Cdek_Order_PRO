import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";

interface PaymentForDeliveryProps {
  selectedTariffSum: number | null;
  isChecked: boolean;
  handleCheckboxChange: () => void;
}

const PaymentForDelivery = ({
  selectedTariffSum,
  isChecked,
  handleCheckboxChange,
}: PaymentForDeliveryProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isChecked && selectedTariffSum !== null) {
      dispatch(
        updateOrderForm({ delivery_recipient_cost: { value: selectedTariffSum } })
      );
    }
  }, [isChecked, selectedTariffSum, dispatch]); // Зависимости для useEffect

  return (
    <>
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: 5, fontSize: 15 }}>
            Взять оплату с получателя за доставку
          </p>
          <div>
            <div style={{ marginTop: 0 }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForDelivery;
