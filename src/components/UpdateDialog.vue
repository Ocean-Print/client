<script lang="ts" setup>
import { PrinterPreview } from "@/api/printer.api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { defineModel, ref } from "vue";

const { printer } = defineProps<{
	printer: PrinterPreview;
}>();

const emits = defineEmits(["clearPrinter"]);

const open = defineModel("open", {
	type: Boolean,
	default: false,
});

const printReceipt = ref(true);

const markSuccess = () => {
	emits("clearPrinter", {
		isSuccess: true,
		printReceipt: printReceipt.value,
	});
	open.value = false;
};

const markFailed = () => {
	emits("clearPrinter", {
		isSuccess: false,
		printReceipt: printReceipt.value,
	});
	open.value = false;
};
</script>

<template>
	<Dialog v-model:open="open" class="absolute">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update {{ printer.name }}</DialogTitle>
				<DialogDescription>
					Clearing a printer will allow another job to start on the printer.
					Before continuing, ensure the printer is ready for the next job.
				</DialogDescription>
			</DialogHeader>

			<div
				class="flex flex-row gap-2 items-center border rounded"
				v-if="printer.currentJob"
			>
				<img
					:src="`/assets/thumbnails/${printer.currentJob.project.hash}.png`"
					class="w-32 h-32"
					v-if="printer.currentJob"
				/>
				<div class="flex flex-col gap-1 h-full p-2">
					<span class="font-bold text-lg">{{
						printer.currentJob?.project.name
					}}</span>
					<span>{{ printer.currentJob?.project.user.name }}</span>
				</div>
			</div>

			<div class="items-top flex gap-x-2" v-if="printer.currentJob">
				<Checkbox id="receipt" v-model:checked="printReceipt" />
				<div class="grid gap-1.5 leading-none">
					<label
						for="receipt"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Print receipt for successful print
					</label>
				</div>
			</div>

			<DialogFooter
				class="flex flex-col md:flex-row gap-2"
				v-if="printer.currentJob"
			>
				<Button @click="markSuccess" class="w-full">Mark Success</Button>
				<Button @click="markFailed" class="w-full" variant="outline"
					>Mark Failed</Button
				>
			</DialogFooter>
			<DialogFooter v-else>
				<Button @click="markSuccess" class="w-full">Mark Printer Clear</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
