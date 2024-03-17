import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import Start from "./Start";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Start></Start>}></Route>
      <Route path="/app/*" element={<App />}></Route>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
