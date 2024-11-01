<script lang="ts" setup>
import ErrorHelpSheet from "./ErrorHelpSheet.vue";
import Button from "./ui/button/Button.vue";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { defineModel, ref } from "vue";

defineProps<{
	data: {
		title: string;
		errors: {
			name: string;
			message: string;
		}[];
	}[];
	name: string;
}>();

const open = defineModel("open", {
	type: Boolean,
	default: false,
});

const showHelpSheet = ref(false);
const errorCode = ref("");

const openHelpSheet = (code: string) => {
	errorCode.value = code;
	showHelpSheet.value = true;
};
</script>

<template>
	<ErrorHelpSheet v-model:open="showHelpSheet" :errorCode="errorCode" />
	<AlertDialog v-model:open="open" class="absolute">
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{{ name }} Errors</AlertDialogTitle>
			</AlertDialogHeader>
			<div class="flex flex-col gap-2">
				<div v-for="section in data" class="flex flex-col gap-1">
					<p class="font-semibold">{{ section.title }}</p>
					<p v-if="section.errors.length === 0">No errors</p>
					<div
						class="flex flex-row rounded-lg bg-card p-2 border items-center"
						v-for="error in section.errors"
					>
						<div class="flex flex-col w-full">
							<p class="font-semibold">{{ error.name }}</p>
							<p>{{ error.message }}</p>
						</div>
						<Button
							v-if="section.title === 'Printer'"
							@click="openHelpSheet(error.name)"
						>
							?
						</Button>
					</div>
				</div>
			</div>
			<AlertDialogFooter>
				<AlertDialogAction @click="open = false">Close</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
