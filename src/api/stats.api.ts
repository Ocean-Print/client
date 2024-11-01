export async function getQueueTime(): Promise<number> {
	return await fetch("/api/stats/queue-time", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			return data.queueTime;
		});
}
