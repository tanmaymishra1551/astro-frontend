import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/wsapi": {
        target: "http://localhost:8000",
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wsapi/, ""),
      },
    },
  },
});
