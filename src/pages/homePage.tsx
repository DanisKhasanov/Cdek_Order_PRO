import { useLocation } from "react-router-dom";
import { SendingPage } from "./sendingPage";
import Navigation from "../components/navigation/navigation";
import LoginPage from "./loginPage";

const Home = () => {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname === "/" ? (
        <SendingPage />
      ) : location.pathname === "/login" ? (
        <LoginPage />
      ) : (
        <Navigation />
      )}
    </div>
  );
};

export default Home;
