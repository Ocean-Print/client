const PAGE_SIZE = 10;

export async function getJobQueue(
	page: number = 0,
): Promise<JobPreviewResponse> {
	return await fetch(
		`/api/jobs?sort=priority:desc,createdAt:asc&state=QUEUED&page=${page}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	).then((response) => response.json());
}

export async function getJobHistory(
	page: number = 0,
): Promise<JobPreviewResponse> {
	return await fetch(
		`/api/jobs?sort=endedAt:desc&state=COMPLETED&state=FAILED&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	).then((response) => response.json());
}

export async function setJobPriority(
	jobId: number,
	priority: number,
): Promise<void> {
	await fetch(`/api/jobs/${jobId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ priority }),
	});
}

export async function deleteJob(jobId: number): Promise<void> {
	await fetch(`/api/jobs/${jobId}`, {
		method: "DELETE",
	});
}

export async function printReceipt(jobId: number): Promise<void> {
	await fetch(`/api/jobs/${jobId}/_receipt`, {
		method: "POST",
	});
}

export async function reprintJob(job: JobPreview): Promise<void> {
	await fetch(`/api/jobs`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			projectId: job.project.id,
		}),
	});
}

export interface JobPreviewResponse {
	jobs: JobPreview[];
	count: number;
}

export interface JobPreview {
	id: number;
	state: "QUEUED" | "PRINTING" | "COMPLETED" | "FAILED";
	priority: number;
	createdAt: string;
	startedAt: string | null;
	endedAt: string | null;
	project: {
		id: number;
		name: string;
		printTime: number;
		hash: string;
		materials: {
			id: number;
			name: string;
			type: string;
			color: string;
			usage: number;
		}[];
		user: {
			id: number;
			name: string;
		};
	};
	printer: {
		id: number;
		name: string;
	};
}
