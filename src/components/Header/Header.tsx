import React from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import OrderForm from "../OrderForm/Order/Order";
import Tariffs from "../OrderForm/Tariffs/Tariffs";
import Waybill from "../OrderForm/Waybill/Waybill";
import "./Header.css";
import Cargo from "../OrderForm/Cargo/Cargo";

const Navigation = () => {
  return (
    <div className="container">
      <div className="App">
        <nav className="header">
      
          <NavLink to="/order" className="nav-link">
            Данные заказа
          </NavLink>
          <NavLink to="/cargo" className="nav-link">
            Грузовое место
          </NavLink>
          <NavLink to="/tariffs" className="nav-link">
            Тарифы
          </NavLink>
          <NavLink to="/waybill" className="nav-link">
            Накладная
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<OrderForm />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/cargo" element={<Cargo />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="/waybill" element={<Waybill />} />
        </Routes>
      </div>
    </div>
  );
};

export default Navigation;
