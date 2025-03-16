import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";

// Transform HTML during build
function htmlUrlPlugin() {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return html.replace(
        /(src|href)="\.?\/(images|sound)\//g,
        `$1="/MinDArT/$2/`
      );
    },
  };
}

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
  plugins: [
    htmlUrlPlugin(),
    VitePWA({
      registerType: "autoUpdate", // Controls update behavior
      injectRegister: null, // Prevents automatic registration
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,ico,png,svg,webp,mp3}"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "MinDArT",
        short_name: "MinDArT",
        description: "Mind art progressive web app, for offline use",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/MinDArT/",
        start_url: "/MinDArT/",
        orientation: "any",
        icons: [
          {
            src: "images/mindart-logo_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "images/mindart-logo_512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "images/mindart-logo_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "images/mindart-logo_mask.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["art", "education", "health"],
      },
    }),
  ],
  publicDir: "assets",
});
