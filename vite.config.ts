import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { replaceCodePlugin } from 'vite-plugin-replace'

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), replaceCodePlugin({
      replacements: [
        {
          from: 'const form_data_1 = __importDefault(require("form-data"));',
          to: ""
        },
        {
          from: "form_data_1.default",
          to: "FormData"
        }
      ]
    })],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
