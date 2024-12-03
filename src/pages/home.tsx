import { useLocation } from "react-router-dom";
import Popups from "./popup";
import SettingPage from "./setting";
import Navigation from "../components/header/navigation";
import "../components/header/Header.css";

const Home = () => {
  // TODO: Сделать так, чтобы кнопки были неактивны если нет counterKey

  const location = useLocation();

  return (
    <div>
      {location.pathname === "/" ? (
        <Popups />
      ) : location.pathname === "/setting" ? (
        <SettingPage />
      ) : (
        <Navigation />
      )}
    </div>
  );
};

export default Home;
