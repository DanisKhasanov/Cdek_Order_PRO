import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";


//TODO: Решить проблему с отображением наложенного платежа




const CashOnDelivery = () => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (orderData.cod===true) {
      setIsAvailable(true);
      setIsEnabled(true);
    } else {
      setIsAvailable(false);
      setIsEnabled(false); 
    }
  }, [orderData.cod]);

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
              <input placeholder={orderData.sum.toString()} readOnly/>
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
