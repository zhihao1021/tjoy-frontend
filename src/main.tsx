import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import "@fontsource-variable/noto-sans-tc/index.css";
import '@fontsource-variable/material-symbols-outlined/full.css';
import "./global.scss";

axios.interceptors.request.use(config => {
  config.baseURL = import.meta.env.VITE_API_END_POINT;

  let token = localStorage.getItem("access_token");
  let tokenType = localStorage.getItem("token_type");
  if (token !== null && tokenType !== null)
    config.headers.Authorization = `${tokenType} ${token}`;

  return config;
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
