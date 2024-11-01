export async function getPrinters(): Promise<PrinterPreview[]> {
	return await fetch("/api/printers", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			return data.printers;
		});
}

export async function getPrinter(id: number): Promise<PrinterDetail> {
	return await fetch(`/api/printers/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			return data.printer;
		});
}

export async function createPrinter(body: any): Promise<PrinterDetail> {
	return await fetch("/api/printers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then((response) => response.json())
		.then((data) => {
			return data.printer;
		});
}

export async function updatePrinter(
	id: number,
	body: any,
): Promise<PrinterDetail> {
	return await fetch(`/api/printers/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then((response) => response.json())
		.then((data) => {
			return data.printer;
		});
}

export async function clearPrinter(
	id: number,
	isSuccess: boolean,
): Promise<PrinterDetail> {
	return await fetch(`/api/printers/${id}/_clear`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			isSuccess: isSuccess,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			return data.printer;
		});
}

export interface PrintersPreviewResponse {
	success: boolean;
	printers: PrinterPreview[];
}

export interface PrinterPreview {
	id: number;
	name: string;
	systemStatus: {
		state: "UNKNOWN" | "ERROR" | "GOOD" | "UPDATING" | "DISPATCHING";
		errors: { name: string; message: string }[];
		progress: number;
		isClear: boolean;
	};
	printerStatus: {
		state: "UNKNOWN" | "IDLE" | "PRINTING" | "PAUSED" | "FINISHED";
		errors: { name: string; message: string }[];
		currentJobName: string;
		progress: number;
		timeRemaining: number;
	};
	materials: {
		type: string;
		color: string;
	}[];
	camera?: string;
	currentJob: {
		id: number;
		project: {
			id: number;
			name: string;
			hash: string;
			user: {
				id: number;
				name: string;
			};
		};
	} | null;
}

export interface PrinterDetailResponse {
	success: boolean;
	printer: PrinterDetail;
}

export interface PrinterDetail {
	id: number;
	name: string;
	systemStatus: {
		state: "UNKNOWN" | "ERROR" | "GOOD" | "UPDATING" | "DISPATCHING";
		errors: { name: string; message: string }[];
		progress: number;
		isClear: boolean;
	};
	printerStatus: {
		state: "UNKNOWN" | "IDLE" | "PRINTING" | "PAUSED" | "FINISHED";
		errors: { name: string; message: string }[];
		currentJobName: string;
		progress: number;
		timeRemaining: number;
	};
	materials: {
		type: string;
		color: string;
	}[];
	options: {
		host: string;
		serial: string;
		accessCode: string;
	};
	camera?: string;
	currentJob: {
		id: number;
		createdAt: string;
		startedAt: string;
		endedAt: null;
		project: {
			id: number;
			name: string;
			hash: string;
			printTime: number;
			printerModel: string;
			user: {
				id: number;
				name: string;
				email: string;
			};
		};
	};
}
