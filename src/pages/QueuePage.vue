<script lang="ts" setup>
import * as JobApi from "@/api/job.api";
import * as StatsApi from "@/api/stats.api";
import JobCard from "@/components/JobCard.vue";
import Spinner from "@/components/Spinner.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, onMounted, computed } from "vue";

const toast = useToast();
const queryClient = useQueryClient();
const page = ref(1);

const jobs = useQuery({
	queryKey: ["jobs", page],
	queryFn: () => JobApi.getJobQueue(page.value - 1),
	refetchInterval: 10000,
});

const setJobPriorityMutation = useMutation({
	mutationKey: ["jobs", "setJobPriority"],
	mutationFn: async (options: { jobId: number; priority: number }) => {
		await JobApi.setJobPriority(options.jobId, options.priority);
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["jobs", page.value] });
		toast.toast({
			title: "Job Prioritized",
			description: "Job priority has been updated",
		});
	},
	onError: (error) => {
		console.error(error);
		toast.toast({
			title: "Error Updating Priority",
			description: "An error occurred while updating the job priority",
			variant: "destructive",
		});
	},
});

const cancelJobMutation = useMutation({
	mutationKey: ["jobs", "cancelJob"],
	mutationFn: async (jobId: number) => {
		await JobApi.deleteJob(jobId);
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["jobs", page.value] });
		toast.toast({
			title: "Job Cancelled",
			description: "Job has been cancelled",
		});
	},
	onError: (error) => {
		console.error(error);
		toast.toast({
			title: "Error Cancelling Job",
			description: "An error occurred while cancelling the job",
			variant: "destructive",
		});
	},
});

const stats = useQuery({
	queryKey: ["stats", "queueTime"],
	queryFn: () => StatsApi.getQueueTime(),
	refetchInterval: 10000,
});

const queueTime = computed(() => {
	let totalMinutes = stats.data.value;
	if (!totalMinutes) return "No queue time";

	let days = Math.floor(totalMinutes / 1440);
	totalMinutes -= days * 1440;
	let hours = Math.floor(totalMinutes / 60);
	totalMinutes -= hours * 60;
	let minutes = totalMinutes;

	let time = "";
	if (days > 0) time += `${days}d `;
	if (hours > 0) time += `${hours}h `;
	if (minutes > 0) time += `${minutes}m`;
	if (time === "") time = "No queue time";
	return time;
});
</script>

<template>
	<div class="flex flex-col gap-4 p-4 w-full h-full overflow-scroll">
		<div class="flex flex-row gap-4 items-center">
			<h1 class="text-3xl font-bold">Job Queue</h1>
			<div class="flex flex-row gap-1">
				<Badge variant="outline" v-if="jobs.data.value"
					>{{ jobs.data.value.count }} job{{
						jobs.data.value.count !== 1 ? "s" : ""
					}}</Badge
				>
				<Badge
					v-if="!stats.isError.value && !stats.isPending.value"
					variant="outline"
					>{{ queueTime }}</Badge
				>
			</div>
		</div>
		<div
			v-if="jobs.isPending.value"
			class="absolute top-0 left-0 w-full flex items-center justify-center p-2"
		>
			<Spinner />
		</div>
		<Alert v-else-if="jobs.isError.value" variant="destructive">
			<AlertTitle>Error Loading Queue</AlertTitle>
			<AlertDescription>
				{{ jobs.error.value?.message }}
			</AlertDescription>
		</Alert>
		<div class="flex flex-col gap-2" v-else-if="jobs.data.value">
			<JobCard
				v-for="job in jobs.data.value.jobs"
				:key="job.id"
				:job="job"
				class="w-full"
				@setPriority="
					setJobPriorityMutation.mutate({ jobId: job.id, priority: $event })
				"
				@cancel="cancelJobMutation.mutate(job.id)"
			/>
			<div
				v-if="jobs.data.value.jobs.length === 0"
				class="text-center text-neutral-500"
			>
				No jobs in the queue
			</div>
		</div>
		<Pagination
			v-if="jobs.data.value && jobs.data.value.count > 0"
			:total="jobs.data.value.count"
			:items-per-page="10"
			v-model:page="page"
			:sibling-count="1"
			show-edges
			:default-page="1"
		>
			<PaginationList v-slot="{ items }" class="flex items-center gap-1">
				<PaginationFirst />
				<PaginationPrev />

				<template v-for="(item, index) in items">
					<PaginationListItem
						v-if="item.type === 'page'"
						:key="index"
						:value="item.value"
						as-child
					>
						<Button
							class="w-10 h-10 p-0"
							:variant="item.value === page ? 'default' : 'outline'"
						>
							{{ item.value }}
						</Button>
					</PaginationListItem>
					<PaginationEllipsis v-else :key="item.type" :index="index" />
				</template>
				<PaginationNext />
				<PaginationLast />
			</PaginationList>
		</Pagination>
	</div>
</template>
