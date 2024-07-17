import Navigation from "./components/Header/Header";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/store";
// import WidgetComponent from "./components/OrderForm/Tariffs/WidgetComponent";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        {/* <WidgetComponent /> */}
      </Router>
    </Provider>
  );
}

export default App;
