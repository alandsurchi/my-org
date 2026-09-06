import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Local dev and `vite preview` proxy /api and /uploads to the backend, exactly
// like server.mjs does in production, so the app always talks to a relative
// /api path. Point BACKEND_URL at a local backend to develop against it.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.BACKEND_URL || process.env.BACKEND_URL || "https://charity-backend-production-944a.up.railway.app";
  const proxy = {
    "/api": { target: backend, changeOrigin: true, secure: true },
    "/uploads": { target: backend, changeOrigin: true, secure: true },
  };

  return {
    server: { host: "::", port: 8080, proxy },
    preview: { port: 8080, proxy },
    plugins: [react()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
