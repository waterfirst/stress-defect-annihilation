import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "es2020",
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    assetsDir: "assets",
    rollupOptions: {
      input: { index: resolve(root, "dev.html") },
    },
  },
});
