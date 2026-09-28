import { commands } from "./tauri";

export async function openPricingPage() {
	await commands.showWindow({ Settings: { page: "license" } });
}
