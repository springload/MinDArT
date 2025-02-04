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
      globPatterns: ["**/*.{html,js,css,png,jpg,webp,mp3,woff2}"],
      // Don't disable in development - let's keep service worker functionality for testing
      disable: false,
      // Additional configuration for better service worker handling
      injectRegister: "auto",
      manifestEntries: undefined, // Let Serwist generate the manifest automatically
      // This ensures the service worker is properly built
      buildPluginContext: {
        // Add service worker as an entry point
        input: {
          sw: "/sw.js",
        },
      },
    }),
  ],

  optimizeDeps: {
    include: ["p5"],
  },
});
