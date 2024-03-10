import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./components/theme/theme.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import DemoAreaMap from "./components/map.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Карта" element={<DemoAreaMap />}/>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>
);
