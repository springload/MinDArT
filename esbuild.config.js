// esbuild.config.js
import * as esbuild from "esbuild";
import { injectManifest } from "@serwist/build";

async function build() {
  // First, build to intermediate file
  await esbuild.build({
    entryPoints: ["sw-source.js"],
    bundle: true,
    outfile: "sw.js",
    format: "esm",
    platform: "browser",
    target: ["chrome70", "firefox78", "safari13", "edge79"],
  });

  const result = await injectManifest({
    swSrc: "sw.js", // The bundled output
    swDest: "sw-final.js", // The final destination
    globDirectory: ".",
    globPatterns: [
      // HTML files
      "*.html",
      "MinDArT-*/*.html",
      // JavaScript files
      "*.js",
      "MinDArT-*/*.js",
      "shared/*.js",
      "libraries/*.min.js",
      // CSS files
      "css/**/*.css",
      // Assets
      "assets/**/*.{png,jpg,svg}",
      "MinDArT-*/assets/**/*.{png,jpg}",
      // Fonts
      "css/fonts/*.woff2",
      // Sound files
      "sound/*.mp3",
    ],
    globIgnores: [
      "node_modules/**/*",
      "dist/**/*",
      "docs/**/*",
      "james_notes/**/*",
      "esbuild.config.js",
      "sw-source.js",
      "sw.js",
      "sw-final.js",
      "package*.json",
      "README.md",
    ],
  });

  if (result.warnings.length > 0) {
    console.warn("Warnings during service worker build:", result.warnings);
  }
  console.log(
    `Precache manifest generated: ${result.count} files, totaling ${result.size} bytes`
  );
}

build().catch(function (err) {
  console.error("Build failed:", err);
  process.exit(1);
});
