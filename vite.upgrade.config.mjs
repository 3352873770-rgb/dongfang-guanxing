import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 12_000_000,
    cssCodeSplit: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/upgrade-entry.jsx"),
      name: "DongFangGuanXingUpgrade",
      formats: ["iife"],
      fileName: () => "upgrade-bundle.js",
    },
    outDir: "upgrade-dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
