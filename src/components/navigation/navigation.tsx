import { NavLink, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import OrderForm from "../../pages/order";
import Cargo from "../../pages/cargo";
import Tariffs from "../../pages/tariffs";
import Waybill from "../../pages/waybill";
import "../styles/navigationStyle.css";
const Navigation = () => {
  const orderCreated = useSelector(
    (state: RootState) => state.orderForm.orderCreated
  );

  return (
    <div className="App">
      <nav className="header">
        <NavLink
          to="/order"
          className={`nav-link ${
            orderCreated === true ? "nav-link-disabled" : ""
          }`}
        >
          Данные заказа
        </NavLink>
        <NavLink
          to="/cargo"
          className={`nav-link ${
            orderCreated === true ? "nav-link-disabled" : ""
          }`}
        >
          Грузовое место
        </NavLink>
        <NavLink
          to="/tariffs"
          className={`nav-link ${
            orderCreated === true ? "nav-link-disabled" : ""
          }`}
        >
          Тарифы
        </NavLink>
        <NavLink
          to="/waybill"
          className={`nav-link ${
            orderCreated === true ? "nav-link-disabled" : ""
          }`}
        >
          Накладная
        </NavLink>
      </nav>
      <Routes>
        <Route path="/order" element={<OrderForm />} />
        <Route path="/cargo" element={<Cargo />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/waybill" element={<Waybill />} />
      </Routes>
    </div>
  );
};

export default Navigation;
