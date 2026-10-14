import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";

import App from "./App";

// The design hides not-yet-revealed
// elements only when JavaScript runs.
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
