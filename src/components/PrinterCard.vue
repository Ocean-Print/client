<script setup lang="ts">
import Button from "./ui/button/Button.vue";
import Progress from "./ui/progress/Progress.vue";
import type { PrinterPreview } from "@/api/printer.api";
import ErrorDialog from "@/components/ErrorDialog.vue";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify/vue";
import { ref, computed, defineEmits } from "vue";

const { printer } = defineProps<{
	printer: PrinterPreview;
}>();

const emits = defineEmits(["clearPrinter"]);

const showPrinterErrorDialog = ref(false);
const showSystemErrorDialog = ref(false);

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
	return "Seeking Clarity";
});

const markPrintSucceeded = async () => {
	emits("clearPrinter", printer.id, true);
};

const markPrintFailure = async () => {
	emits("clearPrinter", printer.id, false);
};
</script>

<template>
	<ErrorDialog
		:title="`${printer.name} System Errors`"
		:errors="printer.systemStatus.errors"
		v-model:open="showSystemErrorDialog"
	/>
	<ErrorDialog
		:title="`${printer.name} Printer Errors`"
		:errors="printer.printerStatus.errors"
		v-model:open="showPrinterErrorDialog"
	/>
	<Card>
		<CardHeader>
			<CardTitle>{{ printer.name }}</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="flex flex-col gap-4">
				<!-- Printer Current Job -->
				<div class="flex flex-row gap-2 items-center">
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
					<div class="flex flex-col gap-2">
						<span class="text-xl h-8 w-full truncate">{{ message }}</span>
						<div class="flex flex-row gap-2 h-8">
							<Badge variant="outline">
								{{ printer.printerStatus.state }}
							</Badge>
							<Badge
								variant="destructive"
								class="cursor-pointer"
								v-if="printer.printerStatus.errors.length > 0"
								@click="showPrinterErrorDialog = true"
							>
								{{ printer.printerStatus.errors.length }} Printer Error{{
									printer.printerStatus.errors.length > 1 ? "s" : ""
								}}
							</Badge>
							<Badge
								variant="destructive"
								class="cursor-pointer"
								v-if="printer.systemStatus.errors.length > 0"
								@click="showSystemErrorDialog = true"
							>
								{{ printer.systemStatus.errors.length }} System Error{{
									printer.systemStatus.errors.length > 1 ? "s" : ""
								}}
							</Badge>
						</div>
					</div>
				</div>
				<!-- Active Printer Progress Bar -->
				<div class="flex flex-row gap-2 items-center">
					<Badge
						variant="outline"
						v-if="['PRINTING', 'PAUSED'].includes(printer.printerStatus.state)"
						>{{ progress.toFixed(0) }}%</Badge
					>
					<Progress :model-value="progress" />
					<Badge
						variant="outline"
						v-if="['PRINTING', 'PAUSED'].includes(printer.printerStatus.state)"
						>{{ timeRemaining }}</Badge
					>
				</div>
			</div>
		</CardContent>
		<CardFooter>
			<div class="flex flex-row gap-2 items-center">
				<Button
					v-if="
						['IDLE', 'FINISHED'].includes(printer.printerStatus.state) &&
						!printer.systemStatus.isClear
					"
					@click="markPrintSucceeded"
				>
					Print Succeeded
				</Button>
				<Button
					variant="outline"
					v-if="
						['IDLE', 'FINISHED'].includes(printer.printerStatus.state) &&
						!printer.systemStatus.isClear
					"
					@click="markPrintFailure"
				>
					Print Failed
				</Button>
			</div>
		</CardFooter>
	</Card>
</template>
