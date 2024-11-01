<script setup lang="ts">
import SidebarItem from "./components/SidebarItem.vue";
import Theme from "@/components/Theme.vue";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

const VERSION = import.meta.env.VITE_OP_VERSION;
const VERSION_DATE = import.meta.env.VITE_OP_VERSION_DATE;
</script>

<template>
	<div class="flex flex-row h-screen">
		<div class="flex flex-col gap-4 border-r p-2 w-18">
			<div class="flex flex-col gap-4 h-full">
				<Popover>
					<PopoverTrigger>
						<img src="/logo-icon.svg" alt="logo" class="w-14 h-14" />
					</PopoverTrigger>
					<PopoverContent>
						<div class="flex flex-col">
							<p class="text-sm">Ocean Print {{ VERSION }}</p>
							<p class="text-sm">
								© {{ new Date(VERSION_DATE).getFullYear() }} Andrew Lemons
							</p>
						</div>
					</PopoverContent>
				</Popover>
				<SidebarItem icon="fa6-solid:print" name="Printers" to="/" />
				<SidebarItem icon="fa6-solid:list-ol" name="Queue" to="/queue" />
				<SidebarItem
					icon="fa6-solid:clock-rotate-left"
					name="History"
					to="/history"
				/>
			</div>
			<div class="flex flex-col gap-4 justify-end">
				<Theme />
			</div>
		</div>
		<div class="flex flex-col gap-4 w-full h-full overflow-hidden">
			<RouterView v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</RouterView>
		</div>
	</div>
	<Toaster />
	<VueQueryDevtools />
</template>
