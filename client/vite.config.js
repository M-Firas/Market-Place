import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://market-place-jj5i.onrender.com/",
  //       secure: false,
  //     },
  //   },
  // },
  base: "/Market-Place/",

  plugins: [react(), tailwindcss()],
});
