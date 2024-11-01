import App from "./App.vue";
import { router } from "./router";
import "./style.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";

createApp(App).use(router).use(VueQueryPlugin).mount("#app");
