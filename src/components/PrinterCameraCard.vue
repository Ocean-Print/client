<script setup lang="ts">
import type { PrinterPreview } from "@/api/printer.api";
import { Badge } from "@/components/ui/badge";
import { computed } from "vue";

const { printer } = defineProps<{
	printer: PrinterPreview;
}>();

const emits = defineEmits(["openErrorDialog"]);

const errorCount = computed(() => {
	return (
		printer.systemStatus.errors.length + printer.printerStatus.errors.length
	);
});
</script>

<template>
	<div class="flex flex-col gap-1">
		<div class="flex flex-row gap-4 items-center justify-between">
			<span class="font-bold">{{ printer.name }}</span>
			<Badge
				variant="destructive"
				@click="emits('openErrorDialog')"
				v-if="errorCount > 0"
				class="cursor-pointer"
			>
				{{ errorCount }} Error{{ errorCount !== 1 ? "s" : "" }}
			</Badge>
			<Badge variant="outline" v-else>{{ printer.printerStatus.state }}</Badge>
		</div>
		<img
			v-if="printer.camera"
			:src="`/assets/thumbnails/${printer.camera}`"
			class="flex w-full aspect-video rounded"
		/>
		<div
			v-else
			class="flex w-full aspect-video rounded bg-muted items-center justify-center"
		>
			<Icon icon="fa-solid:camera" class="w-16 h-16" />
		</div>
	</div>
</template>
