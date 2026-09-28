import type { ApiFetcher } from "@ts-rest/core";
import { afterEach, describe, expect, it, vi } from "vitest";

const spies = vi.hoisted(() => ({
	fetch: vi.fn(),
	settings: vi.fn(async () => ({ serverUrl: "https://cap.so" })),
	analytics: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-http", () => ({ fetch: spies.fetch }));
vi.mock("@cap/web-api-contract", () => ({
	contract: {},
	orgCustomDomainContract: {},
}));
vi.mock("@ts-rest/core", () => ({
	initClient: (_contract: unknown, options: unknown) => options,
}));
vi.mock("~/store", () => ({
	authStore: { get: async () => ({ secret: { api_key: "old-account" } }) },
	generalSettingsStore: { get: spies.settings },
}));
vi.mock("@openpanel/web", () => ({ OpenPanel: spies.analytics }));

import { apiClient, getConfiguredServerUrl } from "./web-api";

describe("local desktop edition", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.clearAllMocks();
	});

	it("ignores an old cloud server and build-time server setting", async () => {
		vi.stubEnv("VITE_SERVER_URL", "https://cap.so");
		expect(await getConfiguredServerUrl()).toBe("hiha-record://offline");
		expect(spies.settings).not.toHaveBeenCalled();
	});

	it("rejects an API request before accessing the HTTP plugin", async () => {
		const { api } = apiClient as unknown as { api: ApiFetcher };
		await expect(
			api({
				path: "https://cap.so/api/desktop/user",
				method: "GET",
				headers: {},
			} as Parameters<ApiFetcher>[0]),
		).rejects.toThrow("sans compte ni service cloud");
		expect(spies.fetch).not.toHaveBeenCalled();
	});

	it("does not initialize analytics even with inherited credentials", async () => {
		vi.stubEnv("VITE_OPENPANEL_CLIENT_ID", "old-client");
		vi.stubEnv("VITE_OPENPANEL_API_URL", "https://t.cap.so");
		const analytics = await import("./analytics");
		analytics.initAnonymousUser();
		analytics.identifyUser("local-user");
		analytics.trackEvent("recording_started");
		analytics.resetUser();
		expect(spies.analytics).not.toHaveBeenCalled();
		expect(spies.fetch).not.toHaveBeenCalled();
	});
});
