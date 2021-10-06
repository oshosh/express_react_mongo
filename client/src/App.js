import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./compontents/views/LandingPage/LandingPage";
import LoginPage from "./compontents/views/LoginPage/LoginPage";
import RegisterPage from "./compontents/views/RegisterPage/RegisterPage";

import Auth from './hoc/auth'

function App() {
  const str = "test props 전달"

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Auth(() => <LandingPage data={str} />, null)} />
        <Route exact path="/login" component={Auth(LoginPage, false)} />
        <Route exact path="/register" component={Auth(RegisterPage, false)} />
      </Switch>
    </Router>
  );
}

export default App;
