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
			username: string;
		};
	};
	printer: {
		id: number;
		name: string;
	};
}
