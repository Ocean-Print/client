<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { computed } from "vue";

const open = defineModel("open", {
	type: Boolean,
	default: false,
});

const { errorCode } = defineProps<{
	errorCode: string;
}>();

const url = computed(() => {
	return `https://wiki.bambulab.com/en/x1/troubleshooting/hmscode/${errorCode}`;
});
</script>

<template>
	<Sheet v-model:open="open">
		<SheetContent class="z-[60] w-full h-full sm:max-w-full flex flex-col">
			<SheetHeader>
				<SheetTitle>Error Help</SheetTitle>
			</SheetHeader>
			<iframe :src="url" class="w-full h-full" frameborder="0"></iframe>
		</SheetContent>
	</Sheet>
</template>
