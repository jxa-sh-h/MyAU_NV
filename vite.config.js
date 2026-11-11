import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: [
        "index.html",
        "pages/library.html",
        "pages/ebsco-database.html",
        "pages/faculty-evaluation.html",
        "pages/online-payment.html",
      ],
    },
  },
});
