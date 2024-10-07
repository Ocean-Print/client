<script lang="ts" setup>
import * as JobApi from "@/api/job.api";
import type { JobPreview } from "@/api/job.api";
import JobCard from "@/components/JobCard.vue";
import Spinner from "@/components/Spinner.vue";
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
import { ref, onMounted } from "vue";

const jobStore = ref({
	isLoading: false,
	interval: null as number | null,
	error: "",
	count: 0,
	page: 0,
	jobs: [] as JobPreview[],
});

const fetchJobs = async () => {
	await JobApi.getJobHistory(jobStore.value.page)
		.then((response) => {
			jobStore.value.count = response.count;
			jobStore.value.jobs = response.jobs;
		})
		.catch((error) => {
			jobStore.value.error = (error as Error).message;
			jobStore.value.count = 0;
			jobStore.value.jobs = [];
			jobStore.value.page = 0;
		});
};

const changePage = (page: number) => {
	jobStore.value.page = page - 1;
	fetchJobs();
};

onMounted(() => {
	jobStore.value.isLoading = true;
	fetchJobs().finally(() => {
		jobStore.value.isLoading = false;
	});
});
</script>

<template>
	<div class="flex flex-col gap-4 p-4 w-full h-full overflow-scroll">
		<div class="flex flex-row gap-4 items-center">
			<h1 class="text-3xl font-bold">Job History</h1>
		</div>
		<div
			v-if="jobStore.isLoading"
			class="absolute top-0 left-0 w-full flex items-center justify-center p-2"
		>
			<Spinner />
		</div>
		<div
			v-if="jobStore.isLoading"
			class="absolute top-0 left-0 w-full flex items-center justify-center p-2"
		>
			<Spinner />
		</div>
		<div v-else-if="jobStore.error" class="text-center text-red-500">
			{{ jobStore.error }}
		</div>
		<div class="flex flex-col gap-2" v-else>
			<JobCard
				v-for="job in jobStore.jobs"
				:key="job.id"
				:job="job"
				class="w-full"
			/>
			<div
				v-if="jobStore.jobs.length === 0"
				class="text-center text-neutral-500"
			>
				No jobs in the history
			</div>
		</div>
		<Pagination
			v-if="jobStore.count > 10"
			v-slot="{ page }"
			:total="jobStore.count"
			@update:page="changePage($event)"
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
