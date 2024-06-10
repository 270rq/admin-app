import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";
import { Router, Link } from "@reach/router";
import DemoAreaMap from "./components/map.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App path="/" />
      <DemoAreaMap path="/Карта" />
    </Router>
  </React.StrictMode>
);