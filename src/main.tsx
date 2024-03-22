import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import Start from "./Start";
// import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
// import Header from "./Header";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={ store }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start></Start>}></Route>
          <Route path="/app/*" element={<App />}></Route>
          {/* <Route path="/app/*" element={<Header />}></Route> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
