import { defineConfig } from "vite";

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
  plugins: [htmlUrlPlugin()],
  publicDir: "assets",
});
