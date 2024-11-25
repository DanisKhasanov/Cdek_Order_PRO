import Navigation from "./components/header/Header";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/store";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <Provider store={store}>
         <SnackbarProvider maxSnack={3}>
      <Router>
        <Navigation />
      </Router>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
