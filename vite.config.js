import { defineConfig } from "vite";

export default defineConfig({
  base: "/MinDArT/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  publicDir: "assets",
});
