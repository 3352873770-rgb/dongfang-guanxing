import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getWorkspaceBuildMetadata } from "./scripts/workspace-metadata.mjs";

const workspaceMetadata = getWorkspaceBuildMetadata();

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/mmeett-fate/" : "/",
  define: {
    __MMEETT_WORKSPACE_BRANCH__: JSON.stringify(workspaceMetadata.branch),
    __MMEETT_WORKSPACE_SHA__: JSON.stringify(workspaceMetadata.shortSha),
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
