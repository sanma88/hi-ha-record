import { describe, expect, it, vi } from "vitest";

import {
	createPermissionMonitor,
	isPermissionGranted,
	permissionStatusFor,
	requestAndVerifyPermission,
} from "~/utils/os-permissions";

describe("os-permissions", () => {
	it("treats only granted and not-needed statuses as permitted", () => {
		expect(isPermissionGranted("granted")).toBe(true);
		expect(isPermissionGranted("notNeeded")).toBe(true);
		expect(isPermissionGranted("empty")).toBe(false);
		expect(isPermissionGranted("denied")).toBe(false);
	});

	it("maps a permission key to the matching OS permission status", () => {
		const check = {
			screenRecording: "granted",
			microphone: "empty",
			camera: "denied",
			accessibility: "notNeeded",
		} as const;

		expect(permissionStatusFor(check, "screenRecording")).toBe("granted");
		expect(permissionStatusFor(check, "microphone")).toBe("empty");
		expect(permissionStatusFor(check, "camera")).toBe("denied");
		expect(permissionStatusFor(check, "accessibility")).toBe("notNeeded");
	});

	it("does not open settings after a successful permission request", async () => {
		const client = {
			requestPermission: vi.fn().mockResolvedValue(undefined),
			openPermissionSettings: vi.fn().mockResolvedValue(undefined),
			doPermissionsCheck: vi.fn().mockResolvedValue({
				screenRecording: "empty",
				microphone: "granted",
				camera: "empty",
				accessibility: "empty",
			}),
		};

		const result = await requestAndVerifyPermission(client, "microphone");

		expect(client.requestPermission).toHaveBeenCalledWith("microphone");
		expect(client.openPermissionSettings).not.toHaveBeenCalled();
		expect(result.status).toBe("granted");
		expect(result.openedSettings).toBe(false);
	});

	it("opens settings when the OS still reports the permission as ungranted", async () => {
		const client = {
			requestPermission: vi.fn().mockResolvedValue(undefined),
			openPermissionSettings: vi.fn().mockResolvedValue(undefined),
			doPermissionsCheck: vi.fn().mockResolvedValue({
				screenRecording: "denied",
				microphone: "empty",
				camera: "empty",
				accessibility: "empty",
			}),
		};

		const result = await requestAndVerifyPermission(client, "screenRecording");

		expect(client.requestPermission).toHaveBeenCalledWith("screenRecording");
		expect(client.openPermissionSettings).toHaveBeenCalledWith(
			"screenRecording",
		);
		expect(result.status).toBe("denied");
		expect(result.openedSettings).toBe(true);
	});

	it("skips the native request and goes straight to settings for denied permissions", async () => {
		const client = {
			requestPermission: vi.fn().mockResolvedValue(undefined),
			openPermissionSettings: vi.fn().mockResolvedValue(undefined),
			doPermissionsCheck: vi.fn().mockResolvedValue({
				screenRecording: "empty",
				microphone: "empty",
				camera: "empty",
				accessibility: "denied",
			}),
		};

		const result = await requestAndVerifyPermission(
			client,
			"accessibility",
			"denied",
		);

		expect(client.requestPermission).not.toHaveBeenCalled();
		expect(client.openPermissionSettings).toHaveBeenCalledWith("accessibility");
		expect(result.status).toBe("denied");
		expect(result.openedSettings).toBe(true);
	});
});

describe("permission monitoring", () => {
	const denied = {
		screenRecording: "denied",
		accessibility: "denied",
		microphone: "granted",
		camera: "granted",
	} as const;

	it("detects permissions granted in Settings without a Grant click", async () => {
		vi.useFakeTimers();
		const granted = { ...denied, accessibility: "granted" } as const;
		const read = vi
			.fn()
			.mockResolvedValueOnce(denied)
			.mockResolvedValue(granted);
		const changed = vi.fn();
		const monitor = createPermissionMonitor(read, changed, vi.fn());
		try {
			await vi.advanceTimersByTimeAsync(0);
			expect(changed).toHaveBeenLastCalledWith(denied);
			await vi.advanceTimersByTimeAsync(1000);
			expect(changed).toHaveBeenLastCalledWith(granted);
		} finally {
			monitor.dispose();
			vi.useRealTimers();
		}
	});

	it("serializes slow native checks and ignores results after disposal", async () => {
		vi.useFakeTimers();
		let resolve!: (value: typeof denied) => void;
		const read = vi.fn(
			() =>
				new Promise<typeof denied>((done) => {
					resolve = done;
				}),
		);
		const changed = vi.fn();
		const monitor = createPermissionMonitor(read, changed, vi.fn());
		try {
			await vi.advanceTimersByTimeAsync(5000);
			await monitor.refresh();
			expect(read).toHaveBeenCalledTimes(1);
			monitor.dispose();
			resolve(denied);
			await vi.advanceTimersByTimeAsync(5000);
			expect(changed).not.toHaveBeenCalled();
			expect(read).toHaveBeenCalledTimes(1);
		} finally {
			monitor.dispose();
			vi.useRealTimers();
		}
	});

	it("recovers after a failed native check", async () => {
		vi.useFakeTimers();
		const error = new Error("temporarily unavailable");
		const read = vi.fn().mockRejectedValueOnce(error).mockResolvedValue(denied);
		const failed = vi.fn();
		const changed = vi.fn();
		const monitor = createPermissionMonitor(read, changed, failed);
		try {
			await vi.advanceTimersByTimeAsync(1000);
			expect(failed).toHaveBeenCalledWith(error);
			expect(changed).toHaveBeenCalledWith(denied);
		} finally {
			monitor.dispose();
			vi.useRealTimers();
		}
	});
});
