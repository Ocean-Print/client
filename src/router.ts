import HistoryPage from "./pages/HistoryPage.vue";
import HomePage from "./pages/HomePage.vue";
import QueuePage from "./pages/QueuePage.vue";
import { createWebHistory, createRouter } from "vue-router";

const routes = [
	{ path: "/", component: HomePage },
	{ path: "/queue", component: QueuePage },
	{ path: "/history", component: HistoryPage },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
