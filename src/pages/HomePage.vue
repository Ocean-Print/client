<script lang="ts" setup>
import * as PrinterApi from "@/api/printer.api";
import { PrinterPreview } from "@/api/printer.api";
import PrinterCard from "@/components/PrinterCard.vue";
import Spinner from "@/components/Spinner.vue";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ref, onMounted, onBeforeUnmount } from "vue";

const printerStore = ref({
	isLoading: false,
	isBusy: false,
	interval: null as ReturnType<typeof setInterval> | null,
	error: "",
	count: 0,
	page: 0,
	printers: [] as PrinterPreview[],
});

const fetchPrinters = async () => {
	if (printerStore.value.isBusy) return;
	printerStore.value.isBusy = true;
	await PrinterApi.getPrinters()
		.then((printers) => {
			printerStore.value.printers = printers;
		})
		.catch((error) => {
			printerStore.value.error = error.message;
		})
		.finally(() => {
			printerStore.value.isBusy = false;
		});
};

const clearPrinter = async (printerId: number, isSuccess: boolean) => {
	await PrinterApi.clearPrinter(printerId, { isSuccess });
	await fetchPrinters();
};

onMounted(() => {
	printerStore.value.interval = setInterval(() => {
		fetchPrinters();
	}, 5000);

	printerStore.value.isLoading = true;
	fetchPrinters().finally(() => {
		printerStore.value.isLoading = false;
	});
});

onBeforeUnmount(() => {
	if (printerStore.value.interval) clearInterval(printerStore.value.interval);
});
</script>

<template>
	<div class="flex flex-col gap-4 p-4 w-full h-full overflow-scroll">
		<div class="flex flex-row gap-4 items-center">
			<h1 class="text-3xl font-bold">Printers</h1>
		</div>
		<div
			v-if="printerStore.isLoading"
			class="absolute top-0 left-0 w-full flex items-center justify-center p-2"
		>
			<Spinner />
		</div>
		<Transition name="fade" mode="out-in">
			<Alert v-if="printerStore.error" variant="destructive">
				<AlertTitle>Error Loading Printers</AlertTitle>
				<AlertDescription>
					{{ printerStore.error }}
				</AlertDescription>
			</Alert>
		</Transition>
		<div
			class="grid grid-cols-1 lg:grid-cols-2 gap-4"
			v-if="!printerStore.isLoading && !printerStore.error"
		>
			<PrinterCard
				v-for="printer in printerStore.printers"
				:printer="printer"
				:key="printer.id"
				@clear-printer="clearPrinter"
			/>
		</div>
	</div>
</template>
