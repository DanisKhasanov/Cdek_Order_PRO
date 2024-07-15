import React from "react";
import "../Style/style.css";

const Tariffs = () => {
  return (
    <>
      <div className="tariffs-container">
        <div className="tariff-option">
          <input type="radio" name="tariff" value="" className="tariff-radio" />
          <div className="tariff-description">
            <span className="tariff-title">До ПВЗ</span>
            <p>Тариф Посылка</p>
            <p>Сроки: 1-2 раб. дн.</p>
            <button className="tariff-button">Выбрать на карте</button>
          </div>
          <div className="tariff-cost">
            <span>+657.5 руб.</span>
            <p>557.5 руб.</p>
          </div>
        </div>

        <div className="tariff-option">
          <input type="radio" name="tariff" value="" className="tariff-radio" />
          <div className="tariff-description">
            <span className="tariff-title">До ПВЗ</span>
            <p>Тариф Посылка</p>
            <p>Сроки: 1-2 раб. дн.</p>
            <button className="tariff-button">Выбрать на карте</button>
          </div>
          <div className="tariff-cost">
            <span>+657.5 руб.</span>
            <p>557.5 руб.</p>
          </div>
        </div>

        <div className="buttons">
          <button className="btn" onClick={() => console.log("Отправить")}>
            Отправить
          </button>
          <button className="next" onClick={() => console.log("Пересчитать")}>
            Пересчитать
          </button>
        </div>


        
      </div>
    </>
  );
};

export default Tariffs;
