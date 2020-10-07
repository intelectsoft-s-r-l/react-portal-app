import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Views from "./views/index";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Router basename={"/clientportal"}>
          <Switch>
            <Route path="/" component={Views} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
