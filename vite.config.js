import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1200,
    sourcemap: true,
    copyPublicDir: true,
  },
  publicDir: "public",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "assets/*.webp",
        "assets/*.png",
        "sound/*.mp3",
        "mindArt_Logo.png",
      ],
      manifest: {
        name: "MinDArT",
        short_name: "MinDArT",
        description: "Mind art progressive web app, for offline use",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "fullscreen",
        icons: [
          {
            src: "assets/mindArt_Logo_96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "assets/mindArt_Logo_152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "assets/mindArt_Logo_384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "assets/mindArt_Logo_384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        scope: "/",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,webp,png,mp3,woff2}"],
      },
    }),
  ],
});
