import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SendingPage } from "./sendingPage";
import Navigation from "../components/navigation/navigation";
import LoginPage from "./loginPage";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
