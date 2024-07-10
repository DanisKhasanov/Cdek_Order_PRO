import React, { useState } from "react";
const CashOnDelivery = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="cash-on-delivery">
      <label className="switch">
        <input type="checkbox" checked={isEnabled} onChange={toggleSwitch} />
        <span className="slider round"></span>
      </label>
      <p>Наложенный платеж: {isEnabled ? "Вкл" : "Выкл"}</p>
    </div>
  );
};

export default CashOnDelivery;
