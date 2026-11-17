import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import App from "./App.jsx";

const demoStorageVersionKey = "myau-demo-storage-version";
const demoStorageVersion = "2";

try {
  const storage = window.localStorage;
  if (storage.getItem(demoStorageVersionKey) !== demoStorageVersion) {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (key?.startsWith("myau-")) storage.removeItem(key);
    }
    storage.setItem(demoStorageVersionKey, demoStorageVersion);
  }
} catch (error) {
  console.error("Unable to clear outdated MyAU demo data.", error);
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
