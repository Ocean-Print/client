<script setup lang="ts">
import type { JobPreview } from "@/api/job.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { computed } from "vue";

const { job } = defineProps<{
	job: JobPreview;
}>();

const emits = defineEmits(["cancel", "setPriority"]);

const printTime = computed(() => {
	const hours = Math.floor(job.project.printTime / 3600);
	const minutes = Math.floor((job.project.printTime % 3600) / 60);
	return `${hours}:${minutes.toString().padStart(2, "0")}`;
});
</script>

<template>
	<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-2">
		<div class="flex flex-row gap-2 items-center">
			<img
				:src="`/assets/thumbnails/${job.project.hash}.png`"
				class="w-16 h-16"
			/>
			<div class="flex flex-col gap-2 grow">
				<span class="text-xl h-8 w-full truncate">{{ job.project.name }}</span>
				<div class="flex flex-row gap-2 h-8">
					<Badge :variant="job.state === 'FAILED' ? 'destructive' : 'outline'">
						{{ job.state }}
					</Badge>
					<Badge variant="outline">
						{{ printTime }}
					</Badge>
					<Badge variant="outline" v-if="job.priority > 0"> Priority </Badge>
				</div>
				<div class="text-neutral-500 text-sm" v-if="job.endedAt">
					Ended at {{ new Date(job.endedAt).toLocaleString() }}
				</div>
			</div>
			<DropdownMenu v-if="job.state === 'QUEUED'">
				<DropdownMenuTrigger>
					<Button variant="outline">Actions</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						@click="emits('setPriority', 1)"
						v-if="job.priority === 0"
						>Prioritize</DropdownMenuItem
					>
					<DropdownMenuItem
						@click="emits('setPriority', 0)"
						v-if="job.priority > 0"
						>Deprioritize</DropdownMenuItem
					>
					<DropdownMenuItem @click="emits('cancel')">Cancel</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
</template>
