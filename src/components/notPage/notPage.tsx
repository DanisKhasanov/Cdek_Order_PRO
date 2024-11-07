import { useNavigate } from "react-router-dom";
import "../orderForm/styles/style.css";

const NotFoundPage = () => {

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-header">404</h1>
        <h2 className="notfound-subheader">Страница не найдена</h2>
        <p className="notfound-text">
          Ой! Страница, которую вы ищете, не существует или у вас нет доступа к
          ней.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
