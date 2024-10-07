<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify/vue";
import { computed, defineProps } from "vue";
import { useRoute } from "vue-router";

const { icon, name, to } = defineProps<{
	icon: string;
	name: string;
	to: string;
}>();

const route = useRoute();

const isActive = computed(() => {
	return route.path === to;
});
</script>

<template>
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger>
				<RouterLink :to="to">
					<Button :variant="isActive ? 'secondary' : 'ghost'">
						<Icon :icon="icon" class="w-5 h-5" />
						<span class="sr-only">Open {{ name }}</span>
					</Button>
				</RouterLink>
			</TooltipTrigger>
			<TooltipContent>
				<p>{{ name }}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>
