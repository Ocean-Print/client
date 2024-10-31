<script lang="ts" setup>
import * as JobApi from "@/api/job.api";
import * as PrinterApi from "@/api/printer.api";
import { PrinterPreview } from "@/api/printer.api";
import ErrorDialog from "@/components/ErrorDialog.vue";
import PrinterCameraCard from "@/components/PrinterCameraCard.vue";
import PrinterCard from "@/components/PrinterCard.vue";
import Spinner from "@/components/Spinner.vue";
import UpdateDialog from "@/components/UpdateDialog.vue";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";

const queryClient = useQueryClient();

const printers = useQuery({
	queryKey: ["printers"],
	queryFn: PrinterApi.getPrinters,
	refetchInterval: 2500,
});

const clearPrinterMutation = useMutation({
	mutationKey: ["clear-printer"],
	mutationFn: async (options: {
		printerId: number;
		isSuccess: boolean;
		printReceipt: boolean;
	}) => {
		let currentJob = undefined;
		if (printers.data.value)
			currentJob = printers.data.value.find(
				(p: PrinterPreview) => p.id === options.printerId,
			)?.currentJob?.id;
		await PrinterApi.clearPrinter(options.printerId, options.isSuccess);
		if (options.isSuccess && currentJob && options.printReceipt) {
			await JobApi.printReceipt(currentJob);
		}
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["printers"] });
	},
});

const viewMode = ref("preview");

const showErrorDialog = ref(false);
const showUpdateDialog = ref(false);
const dialogTarget = ref<PrinterPreview | null>(null);

const openErrorDialog = (printer: PrinterPreview) => {
	dialogTarget.value = printer;
	showErrorDialog.value = true;
};

const openUpdateDialog = (printer: PrinterPreview) => {
	dialogTarget.value = printer;
	showUpdateDialog.value = true;
};

const clearPrinter = (
	printerId: number,
	{ isSuccess, printReceipt }: { isSuccess: boolean; printReceipt: boolean },
) => {
	clearPrinterMutation.mutate({ printerId, isSuccess, printReceipt });
};
</script>

<template>
	<ErrorDialog
		v-if="dialogTarget"
		:name="dialogTarget.name"
		:data="[
			{ title: 'System', errors: dialogTarget.systemStatus.errors },
			{ title: 'Printer', errors: dialogTarget.printerStatus.errors },
		]"
		v-model:open="showErrorDialog"
	/>
	<UpdateDialog
		v-if="dialogTarget"
		:printer="dialogTarget"
		v-model:open="showUpdateDialog"
		@clear-printer="(s) => clearPrinter(dialogTarget.id, s)"
	/>
	<div class="flex flex-col gap-4 p-4 w-full h-full overflow-scroll">
		<div class="flex flex-row gap-4 items-center justify-between">
			<h1 class="text-3xl font-bold">Printers</h1>
			<ToggleGroup v-model="viewMode" type="single" size="sm" variant="outline">
				<ToggleGroupItem value="preview">
					<Icon icon="mdi:printer-3d" class="w-5 h-5" />
				</ToggleGroupItem>
				<ToggleGroupItem value="camera">
					<Icon icon="mdi:camera" class="w-5 h-5" />
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
		<div
			v-if="printers.isPending.value"
			class="absolute top-0 left-0 w-full flex items-center justify-center p-2"
		>
			<Spinner />
		</div>
		<Alert v-else-if="printers.isError.value" variant="destructive">
			<AlertTitle>Error Loading Printers</AlertTitle>
			<AlertDescription>
				{{ printers.error.value?.message }}
			</AlertDescription>
		</Alert>
		<div
			v-else-if="viewMode === 'preview'"
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
		>
			<PrinterCard
				v-for="printer in printers.data.value"
				:printer="printer"
				:key="printer.id"
				@open-error-dialog="openErrorDialog(printer)"
				@open-update-dialog="openUpdateDialog(printer)"
			/>
		</div>
		<div
			v-else-if="viewMode === 'camera'"
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
		>
			<PrinterCameraCard
				v-for="printer in printers.data.value"
				:printer="printer"
				:key="printer.id"
				@open-error-dialog="openErrorDialog(printer)"
			/>
		</div>
		<p class="text-muted">
			Last updated
			{{ new Date(printers.dataUpdatedAt.value).toLocaleTimeString() }}
		</p>
	</div>
</template>
