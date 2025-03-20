import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), TanStackRouterVite(), reactRefresh()],
});
