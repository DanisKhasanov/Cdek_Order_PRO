import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useState } from "react";
import { updateOrderForm } from "../../../store/reducers/OrderReducer";
import { TariffActionsProps } from "../../../props/TariffActionsProps";
import { DELIVERY_MODE } from "../../../enum/DeliveryMode";
import DoorDelivery from "./DoorDelivery";

const TariffActions = ({
  selectedTariff,
  tariffCode,
  deliveryName,
}: TariffActionsProps) => {
  const [showAddressInput, setShowAddressInput] = useState(false);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [showComment, setShowComment] = useState(false);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const handleShowAddressInput = (deliveryName: number) => {
    if (deliveryName === DELIVERY_MODE.DOOR) {
      setShowAddressInput(!showAddressInput);
    }
  };
  const handleShowComment = (deliveryName: number) => {
    setShowComment(!showComment);
  };

  const handleChangeAddress = () => {
    dispatch(
      updateOrderForm({
        ...orderData,
        to_location: { ...orderData.to_location, address: address },
      })
    );
    setShowAddressInput(false);
  };
  return (
    <div>

      {selectedTariff === tariffCode && (
        <div>
      <DoorDelivery />



        <div style={{ display: "flex", gap: "10px", marginTop: 3 }}>
          <button
            className={`address-button ${
              selectedTariff !== null && selectedTariff !== tariffCode
                ? "dimmed"
                : ""
            }`}
            onClick={() => handleShowAddressInput(deliveryName)}
          >
            Изменить адрес
          </button>
          <button
            className={`address-button ${
              selectedTariff !== null && selectedTariff !== tariffCode
                ? "dimmed"
                : ""
            }`}
            onClick={() => handleShowComment(deliveryName)}
          >
            Показать комментарий
          </button>
        </div>
        </div>
      )}

      {showAddressInput && selectedTariff === tariffCode && (
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={orderData.to_location.address}
            className="address-input"
          />

          <button
            onClick={() => {
              if (!address) {
                alert("Адрес не может быть пустым");
                return;
              }
              handleChangeAddress();
            }}
            className="save-btn"
          >
            Сохранить
          </button>
        </div>
      )}

      {showComment && selectedTariff === tariffCode && (
        <div className="address-input">{orderData.comment}</div>
      )}
    </div>
  );
};

export default TariffActions;
