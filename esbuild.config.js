import * as esbuild from "esbuild";
import { injectManifest } from "@serwist/build";

async function build() {
  // First, build the service worker
  await esbuild.build({
    entryPoints: ["sw.js"],
    bundle: true,
    outfile: "dist/sw.js",
    format: "esm",
    platform: "browser",
    target: ["chrome70", "firefox78", "safari13", "edge79"],
  });

  const result = await injectManifest({
    swSrc: "dist/sw.js",
    swDest: "dist/sw.js",
    globDirectory: ".",
    globPatterns: [
      // HTML files
      "*.html",
      "MinDArT-*/*.html",
      // JavaScript files
      "*.js",
      "MinDArT-*/*.js",
      "shared/*.js",
      "libraries/*.min.js", // only minified versions
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
      "sw.js",
      "package*.json",
      "README.md",
    ],
    maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // p5.js is currently 4.5MB — adding some headroom
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
