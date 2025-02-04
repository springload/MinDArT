import { defineConfig } from "vite";
import { serwist } from "@serwist/vite";

export default defineConfig({
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    // Increase the warning limit since p5.js is large
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      input: {
        main: "/index.html",
      },
      output: {
        // Improve chunking strategy
        manualChunks: (id) => {
          // Put p5.js in its own chunk
          if (id.includes("p5")) {
            return "p5";
          }
          // Group app files together
          if (id.includes("/apps/")) {
            return "drawing-apps";
          }
          // Group components together
          if (id.includes("/components/")) {
            return "components";
          }
          // Group utils together
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
          if (/\.(png|jpe?g|svg)$/.test(name ?? "")) {
            return "assets/[name][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "css/[name]-[hash][extname]";
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
      swDest: "./dist/sw.js",
      globDirectory: "dist",
      globPatterns: ["**/*.{html,js,css,png,webp,jpg,mp3,woff2}"],
      disable: process.env.NODE_ENV === "development",
    }),
  ],

  optimizeDeps: {
    include: ["p5"],
  },
});
