import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate", // Better for fonts
            options: {
              cacheName: "google-fonts-css",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
      manifest: {
        name: "Lion PR Services",
        short_name: "Lion Services",
        description: "Sistema de gestión de laboratorio médico",
        theme_color: "#011140",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/pwa-72x82.webp", sizes: "72x82", type: "image/webp" },
          { src: "/pwa-96x109.webp", sizes: "96x109", type: "image/webp" },
          { src: "/pwa-128x145.webp", sizes: "128x145", type: "image/webp" },
          { src: "/pwa-144x163.webp", sizes: "144x163", type: "image/webp" },
          { src: "/pwa-152x172.webp", sizes: "152x172", type: "image/webp" },
          { src: "/pwa-192x218.webp", sizes: "192x218", type: "image/webp" },
          { src: "/pwa-384x436.webp", sizes: "384x436", type: "image/webp" },
          {
            src: "/pwa-469x532.webp",
            sizes: "469x532",
            type: "image/webp",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot.webp",
            sizes: "1359x647",
            type: "image/webp",
            form_factor: "wide",
          },
          {
            src: "/narrowScreenshot.webp",
            sizes: "1359x647",
            type: "image/webp",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          charts: ["@nivo/bar", "@nivo/pie", "@nivo/core"],
          utils: ["axios", "lodash.debounce"],
        },
      },
    },
    minify: "esbuild",
    target: "es2015",
  },
  optimizeDeps: {
    include: ["@mui/material", "@nivo/bar", "@nivo/pie"],
  },
});
