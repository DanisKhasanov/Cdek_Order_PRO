import { useState } from "react";
import { updateServices } from "../../store/reducers/OrderReducer";
import { useDispatch } from "react-redux";
import { DOOR_DELIVERY } from "../../enum/DoorDelivery";

const LiftCargo = () => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [manual, setManual] = useState("");
  const [activeButton, setActiveButton] = useState<"manual" | "lift">("lift");
  const [inputError, setInputError] = useState(false);

  const toggleSwitch = () => {
    if (isAvailable) {
      setIsEnabled(!isEnabled);
      if (isEnabled) {
        dispatch(updateServices(null));
      } else {
        dispatch(updateServices({ code: DOOR_DELIVERY.LIFT, parameter: "" }));
      }
      setShowInput(false);
    }
  };

  const handleButtonClick = (buttonType: "manual" | "lift") => () => {
    setActiveButton(buttonType);
    setShowInput(buttonType === "manual");
    const code =
      buttonType === "manual" ? DOOR_DELIVERY.MANUAL : DOOR_DELIVERY.LIFT;
    dispatch(
      updateServices({ code, parameter: buttonType === "manual" ? manual : "" })
    );
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setManual(value);
    dispatch(
      updateServices({
        code: DOOR_DELIVERY.MANUAL,
        parameter: value,
      })
    );
    setInputError(value.trim() === "" && activeButton === "manual");
  };

  return (
    <div className="cash-on-delivery tariff">
      <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
        <label className="switch">
          <input type="checkbox" checked={isEnabled} onChange={toggleSwitch} />
          <span className="slider round"></span>
        </label>
        <p style={{ marginLeft: 10, marginTop: 4 }}>Подъем груза на этаж</p>
      </div>

      <div className="delivery-options">
        {isEnabled && isAvailable && (
          <div className="buttons-container">
            <button
              className={`lift ${activeButton === "lift" ? "active" : ""}`}
              onClick={handleButtonClick("lift")}
            >
              Подъем на этаж лифтом
            </button>
            <button
              className={`manual ${activeButton === "manual" ? "active" : ""}`}
              onClick={handleButtonClick("manual")}
            >
              Подъем на этаж ручной
            </button>
          </div>
        )}

        {showInput && isEnabled && (
          <div className="manual-input-container">
            <input
              type="number"
              min={1}
              value={manual}
              onChange={handleInputChange}
              placeholder={
                inputError ? "Это обязательное поле" : "Введите этаж"
              }
              className={`manual-input ${inputError ? "error" : ""}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiftCargo;
