import { defineConfig } from "vite";
import { serwist } from "@serwist/vite";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      input: {
        main: "/index.html",
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("p5")) {
            return "p5";
          }
          if (id.includes("/apps/")) {
            return "drawing-apps";
          }
          if (id.includes("/components/")) {
            return "components";
          }
          if (id.includes("/utils/")) {
            return "utils";
          }
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(mp3|wav)$/.test(name ?? "")) {
            return "sound/[name][extname]";
          }
          if (/\.(png|jpe?g|svg|webp)$/.test(name ?? "")) {
            return "assets/[name]-[hash][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "css/[name]-[hash][extname]";
          }
          if (/\.(woff2?)$/.test(name ?? "")) {
            return "assets/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  plugins: [
    serwist({
      swSrc: "./sw.js",
      swDest: "dist/sw.js",
      globDirectory: "dist",
      globPatterns: ["**/*.{html,js,css}", "assets/**/*", "sound/**/*"],
    }),
  ],

  optimizeDeps: {
    include: ["p5"],
  },
});
