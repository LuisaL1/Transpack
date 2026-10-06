import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/index.css";

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// En producción cada ruta llega con su HTML pre-generado (SEO) y se hidrata.
// Si el HTML es de otra ruta (404.html en una URL desconocida, vista previa
// local) o no hay HTML (pnpm dev), se renderiza desde cero.
const here = window.location.pathname.replace(/\/+$/, "") || "/";
if (root.firstElementChild && root.dataset.path === here) ReactDOM.hydrateRoot(root, app);
else {
  root.textContent = "";
  ReactDOM.createRoot(root).render(app);
}
