import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const CashOnDelivery = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (orderData.payment > 0) {
      setIsAvailable(true);
      setIsEnabled(true);
    } else {
      setIsAvailable(false);
      setIsEnabled(false); 
    }
  }, [orderData.payment]);

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
              <input placeholder={orderData.weight.toString()} readOnly/>
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
