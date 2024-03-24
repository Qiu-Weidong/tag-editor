import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import Start from "./page/start/Start";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import CaptionEditor from "./page/edit/CaptionEditor";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/app/*" element={<App />}></Route>
          <Route path="/edit" element={<CaptionEditor />}></Route>
          <Route path="/settings" element={"settings page is coming soon."}></Route>
          <Route path="/help" element={"help page is coming soon."}></Route>
          <Route path="*" element={"404"}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
