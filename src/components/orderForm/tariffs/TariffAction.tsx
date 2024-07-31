import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { forwardRef, useState } from "react";
import {
  editCargoSpace,
  updateOrderForm,
} from "../../../store/reducers/OrderReducer";
import { TariffActionsProps } from "../../../props/TariffActionsProps";
import { DELIVERY_MODE } from "../../../enum/DeliveryMode";
import DoorDelivery from "./DoorDelivery";
import { AddressSuggestions } from "react-dadata";
import { StyledInput } from "./StyleInputAddress";

const TariffActions = ({
  selectedTariff,
  tariffCode,
  deliveryName,
}: TariffActionsProps) => {
  const [showAddressInput, setShowAddressInput] = useState(false);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [showComment, setShowComment] = useState(false);
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;

  const CustomInput = forwardRef((props, ref: any) => (
    <StyledInput {...props} ref={ref} />
  ));
  const handleShowAddressInput = (deliveryName: number) => {
    if (deliveryName === DELIVERY_MODE.DOOR) {
      setShowAddressInput(!showAddressInput);
    }
  };
  const handleShowComment = () => {
    setShowComment(!showComment);
  };
  const handleChangeComment = () => {
    dispatch(
      updateOrderForm({
        ...orderData,
        comment_delivery: comment,
      })
    );
    setShowComment(false);
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
              onClick={() => handleShowComment()}
            >
              Указать комментарий
            </button>
          </div>
        </div>
      )}

      {showAddressInput && selectedTariff === tariffCode && (
        <div style={{ display: "flex", gap: "10px" }}>
          <AddressSuggestions
            token={apiKey}
            onChange={(suggestion: any) => {
              setAddress(suggestion.unrestricted_value);
            }}
            customInput={CustomInput}
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
        <div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="address-input"
            placeholder="Укажите комментарий"
          />

          <button
            onClick={() => {
              handleChangeComment();
            }}
            className="save-btn"
          >
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
};

export default TariffActions;
