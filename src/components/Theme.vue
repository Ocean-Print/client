<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/vue";
import { useColorMode } from "@vueuse/core";

// Pass { disableTransition: false } to enable transitions
const mode = useColorMode();
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="outline">
				<Icon
					icon="fa6-solid:brush"
					class="h-[1.2rem] w-[1.2rem] transition-all"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
			<DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
			<DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
