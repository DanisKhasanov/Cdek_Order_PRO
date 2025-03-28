import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateOrderForm } from "../../store/reducers/OrderReducer";

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
    dispatch(
      updateOrderForm({
        deliveryRecipientCost: { value: isChecked && selectedTariffSum !== null ? selectedTariffSum : 0 },
      })
    );
  }, [isChecked, selectedTariffSum, dispatch]);

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
