import React, { useState } from "react";

const CashOnDelivery = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); 
  const toggleSwitch = () => {
    if (isAvailable) {
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="cash-on-delivery">
      <label className="switch">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={toggleSwitch}
          disabled={!isAvailable}
        />
        <span className="slider round"></span>
      </label>
      <p style={{ marginTop: 10 }}>Наложенный платеж</p>
      {isEnabled && isAvailable && (
        <div style={{ marginTop: 10 }}>
          {/* <div>
          <div style={{display: 'flex'}}>
            <label>* Оплата за ед. товара</label>
            <input style={{width: '100px'}} type="number" />
          </div>
          <div>
            <label>* Ставка НДС</label>
            <input type="number" />
          </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CashOnDelivery;
