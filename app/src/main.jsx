import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { startAnalytics } from "./lib/analytics";

// Before the first render, so tags set by components (theme) reach Clarity's queue.
startAnalytics();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
