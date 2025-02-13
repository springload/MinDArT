import { defineConfig } from "vite";

export default defineConfig({
  base: "/MinDArT/",
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  publicDir: "assets",
});
