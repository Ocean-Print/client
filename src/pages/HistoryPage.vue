<script lang="ts" setup>
import * as JobApi from "@/api/job.api";
import type { JobPreview } from "@/api/job.api";
import JobCard from "@/components/JobCard.vue";
import Spinner from "@/components/Spinner.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const toast = useToast();

const page = ref(1);

const jobs = useQuery({
	queryKey: ["jobs", "history", page],
	queryFn: () => JobApi.getJobHistory(page.value - 1),
	refetchInterval: 10000,
});

const reprintJob = async (job: JobPreview) => {
	await JobApi.reprintJob(job);
	toast.toast({
		title: "Job Reprinted",
		description: "Job reprint has been added to the queue",
	});
};
</script>

<template>
	<div class="flex flex-col gap-4 p-4 w-full h-full overflow-scroll">
		<div class="flex flex-row gap-4 items-center">
			<h1 class="text-3xl font-bold">Job History</h1>
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
				@reprint="() => reprintJob(job)"
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
