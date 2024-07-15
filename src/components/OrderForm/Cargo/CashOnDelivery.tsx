import React, { useState } from "react";
import Order from '../../../api/testData'
const CashOnDelivery = () => {

  const order = Order; // буду получать тут сумму из МС и данные о Нал. Платеже

  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleSwitch = () => {
    if (isAvailable) {
      setIsEnabled(!isEnabled);
    }
  };

  return (
    <div className="cash-on-delivery">
      <div style={{marginTop: 10}}>
        <label className="switch">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggleSwitch}
            disabled={!isAvailable}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="cash-on-delivery-container">
        <p className="cash-on-delivery-text">Наложенный платеж</p>
        {isEnabled && isAvailable && (
          <div className="cash-on-delivery-form">
            <div className="cash-on-delivery-form-group">
              <label>Оплата за ед. товара</label>
              <input placeholder="Сумма из МС" readOnly/>
            </div>
            <div className="cash-on-delivery-form-group">
              <label>Ставка НДС</label>
              <input placeholder="Без НДС" readOnly/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashOnDelivery;
