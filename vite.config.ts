import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  optimizeDeps: {
    exclude: ["three/webgpu"],
    include: ["react-force-graph-3d"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "3d-force-graph": path.resolve(__dirname, "./node_modules/3d-force-graph/dist/3d-force-graph.mjs"),
      "three-render-objects": path.resolve(__dirname, "./node_modules/three-render-objects/dist/three-render-objects.mjs"),
      "three/webgpu": "three",
      "three/examples/jsm/controls/TrackballControls.js": "three/examples/jsm/controls/OrbitControls.js",
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
