import Navigation from "./components/Header/Header";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
      </Router>
    </Provider>
  );
}

export default App;
