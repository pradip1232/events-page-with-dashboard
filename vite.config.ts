import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  server: {
    port: 5173,
    host: "localhost",
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
    proxy: {
      "/api": {
        target: "https://localhost", // XAMPP HTTPS server (default port 443)
        changeOrigin: true,
        secure: false, // Bypass self-signed certificate
        rewrite: (path) => path.replace(/^\/api/, ""), // Map /api/events/* to /events/*
      },
    },
  },
});