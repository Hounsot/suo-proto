import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative paths support both username.github.io and repository subpaths.
  base: "./",
  plugins: [react(), tailwindcss()],
});
