<script lang="ts" setup>
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { defineModel } from "vue";

defineProps<{
	errors: {
		name: string;
		message: string;
	}[];
	title: string;
}>();

const open = defineModel("open", {
	type: Boolean,
	default: false,
});
</script>

<template>
	<AlertDialog v-model:open="open" class="absolute">
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{{ title }}</AlertDialogTitle>
				<AlertDialogDescription>
					<div class="flex flex-col gap-2">
						<div class="rounded-lg bg-card p-2 border" v-for="error in errors">
							<p class="font-semibold">{{ error.name }}</p>
							<p>{{ error.message }}</p>
						</div>
					</div>
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogAction @click="open = false">Close</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
