import { version } from "./package.json";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "node:path";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

process.env.VITE_OP_VERSION = "v" + version;
process.env.VITE_OP_VERSION_DATE = new Date().toISOString();

export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()],
		},
	},
	plugins: [vue()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "./dist",
	},
	server: {
		port: 8080,
		proxy: {
			"/api": "http://localhost:3000",
			"/octoprint": "http://localhost:3000",
			"/assets": "http://localhost:3000",
		},
	},
});
