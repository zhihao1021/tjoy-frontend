import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

const scssOptions: Array<string> = [
  `@use "@/styles/colors" as *;`,
  `@use "@/styles/mixins" as *;`,
  `@use "@/styles/variables" as *;`,
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `${scssOptions.join("\n")}\n`
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    }
  },
})
