import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useState } from "react";
import { updateOrderForm } from "../../store/reducers/OrderReducer";
import { DELIVERY_MODE } from "../../enum/DeliveryMode";
import { AddressSuggestions } from "react-dadata";
import { CustomInput } from "../setting/inputSetting";
import { FormInputsTariffsProps } from "../../props/FormInputsTariffsProps";

export const FormInputsTariffs = ({
  selectedTariff,
  tariffCode,
  deliveryName,
}: FormInputsTariffsProps) => {
  const [showAddressInput, setShowAddressInput] = useState(false);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [showComment, setShowComment] = useState(false);
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_DADATA_API_KEY;

  const handleShowAddressInput = (deliveryName: number) => {
    if (deliveryName === DELIVERY_MODE.DOOR) {
      setShowAddressInput(!showAddressInput);
    }
  };

  const handleShowComment = () => {
    setShowComment(!showComment);
  };

  const changeComment = () => {
    dispatch(
      updateOrderForm({
        ...orderData,
        commentDelivery: comment,
      })
    );
    setShowComment(false);
  };
  //TODO: меняет только адресс а не все поля , исправить!
  const changeAddress = () => {
    if (!address.trim()) {
      setError("Адрес не может быть пустым");
      return;
    }
    setError("");
    dispatch(
      updateOrderForm({
        ...orderData,
        toLocation: { ...orderData.toLocation, address: address },
      })
    );
    setShowAddressInput(false);
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginTop: 8 }}>
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

      {showAddressInput && selectedTariff === tariffCode && (
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div style={{ width: "300px" }}>
            <AddressSuggestions
              token={apiKey}
              onChange={(suggestion: any) => {
                setAddress(suggestion.value);
              }}
              inputProps={{
                placeholder: "Введите адрес",
              }}
              count={3}
              customInput={CustomInput}
              defaultQuery={orderData.toLocation?.city}
            />
          </div>

          <button onClick={changeAddress} className="save-btn">
            Сохранить
          </button>
        </div>
      )}

      {error && showAddressInput && (
        <p style={{ color: "red", fontSize: 12 }}>{error}</p>
      )}

      {showComment && selectedTariff === tariffCode && (
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ width: "300px" }}>
            <CustomInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Укажите комментарий"
            />
          </div>

          <button onClick={changeComment} className="save-btn">
            Сохранить
          </button>
        </div>
      )}
    </>
  );
};
