import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@common",
        replacement: path.resolve(__dirname, "src/lib/common"),
      },
      { find: "@hooks", replacement: path.resolve(__dirname, "src/lib/hooks") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/lib/components"),
      },
    ],
  },
});
