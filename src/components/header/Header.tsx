import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import Tariffs from "../orderForm/tariffs/Tariffs";
import Waybill from "../orderForm/waybill/Waybill";
import "./Header.css";
import Cargo from "../orderForm/cargo/Cargo";
import OrderForm from "../orderForm/order/Order";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Popups from "../orderForm/popup/popup";
import SettingPage from "../setting/settingPage";

const Navigation = () => {
  const orderCreated = useSelector(
    (state: RootState) => state.orderForm.orderCreated
  );

  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" ? (
        <Popups />
      ) : location.pathname === "/setting" ? (
        <SettingPage />
      ) : (
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
      )}
    </div>
  );
};

export default Navigation;
