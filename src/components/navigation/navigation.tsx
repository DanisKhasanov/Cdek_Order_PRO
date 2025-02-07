import { NavLink, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import OrderForm from "../../pages/orderPage";
import Cargo from "../../pages/cargoPage";
import Tariffs from "../../pages/tariffsPage";
import Waybill from "../../pages/waybillPage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

const Navigation = () => {
  const orderCreated = useSelector(
    (state: RootState) => state.orderForm.orderCreated
  );
  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <div className="AppHome">
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleClick}
        sx={{
          position: "fixed",
          top: "20px",
          left: "20px",
          borderRadius: "10px",
          cursor: "pointer",
          textTransform: "none",
          width: "300px",
          backgroundColor: "#e0e0e0",
          
        }}
      >
        Назад к вводу номера заказа
      </Button>
      <div className="AppContainer">
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
    </div>
  );
};

export default Navigation;
