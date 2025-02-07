import Home from "./pages/homePage";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/store";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <Router>
          <Home />
        </Router>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
