<script setup lang="ts">
import Button from "./ui/button/Button.vue";
import Progress from "./ui/progress/Progress.vue";
import type { PrinterPreview } from "@/api/printer.api";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/vue";
import { ref, computed, defineEmits } from "vue";

const { printer } = defineProps<{
	printer: PrinterPreview;
}>();

const emit = defineEmits(["openErrorDialog", "openUpdateDialog"]);

const timeRemaining = computed(() => {
	const hours = Math.floor(printer.printerStatus.timeRemaining / 60);
	const minutes = printer.printerStatus.timeRemaining % 60;
	return `${hours}:${minutes.toString().padStart(2, "0")}`;
});

const progress = computed(() => {
	if (printer.systemStatus.state === "DISPATCHING")
		return printer.systemStatus.progress * 100;
	if (printer.printerStatus.state === "IDLE" && printer.systemStatus.isClear)
		return 0;
	return printer.printerStatus.progress * 100;
});

const message = computed(() => {
	if (printer.printerStatus.state === "PRINTING") {
		if (printer.currentJob)
			return `Printing ${printer.currentJob.project.name}`;
		return "Printing";
	}
	if (printer.printerStatus.state === "PAUSED") return "Paused";
	if (
		["IDLE", "FINISHED"].includes(printer.printerStatus.state) &&
		printer.currentJob &&
		!printer.systemStatus.isClear
	)
		return `Completed ${printer.currentJob.project.name}`;
	if (printer.systemStatus.state === "DISPATCHING")
		return "Dispatching a print";
	if (printer.systemStatus.isClear) return "Waiting for print";
	return "Seeking clarity";
});

const showTimeRemaining = computed(() => {
	return printer.printerStatus.state === "PRINTING";
});

const showProgressPercentage = computed(() => {
	return (
		printer.printerStatus.state === "PRINTING" ||
		printer.systemStatus.state === "DISPATCHING"
	);
});

const showUpdateButton = computed(() => {
	return (
		["IDLE", "FINISHED"].includes(printer.printerStatus.state) &&
		!printer.systemStatus.isClear
	);
});

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
				@click="emit('openErrorDialog')"
				v-if="errorCount > 0"
				class="cursor-pointer"
			>
				{{ errorCount }} Error{{ errorCount !== 1 ? "s" : "" }}
			</Badge>
			<Badge variant="outline" v-else>{{ printer.printerStatus.state }}</Badge>
		</div>
		<div class="flex flex-col gap-1 border rounded p-2">
			<div class="flex flex-row gap-1">
				<img
					:src="`/assets/thumbnails/${printer.currentJob.project.hash}.png`"
					class="w-16 h-16"
					v-if="printer.currentJob"
				/>
				<div
					class="w-16 h-16 p-4"
					v-else-if="printer.systemStatus.state === 'DISPATCHING'"
				>
					<Icon icon="fa-solid:paper-plane" class="w-full h-full" />
				</div>
				<div
					class="w-16 h-16 p-4"
					v-else-if="printer.printerStatus.state === 'IDLE'"
				>
					<Icon icon="fa-solid:clock" class="w-full h-full" />
				</div>
				<div class="w-16 h-16 p-4" v-else>
					<Icon icon="fa-solid:crow" class="w-full h-full" />
				</div>
				<div class="flex flex-col gap-2 justify-center">
					<span>{{ message }}</span>
					<div class="flex flex-row gap-1" v-if="printer.currentJob">
						<Badge variant="outline">{{
							printer.currentJob?.project.user.name
						}}</Badge>
					</div>
				</div>
			</div>
			<div v-if="showUpdateButton">
				<Button class="w-full" @click="emit('openUpdateDialog')">
					Clear Printer
				</Button>
			</div>
			<div class="flex flex-row justify-between items-center gap-1 h-10" v-else>
				<Badge variant="outline" v-if="showProgressPercentage"
					>{{ Math.round(printer.printerStatus.progress * 100) }}%</Badge
				>
				<Progress v-model="progress" class="w-full" />
				<Badge variant="outline" v-if="showTimeRemaining">{{
					timeRemaining
				}}</Badge>
			</div>
		</div>
	</div>
</template>
