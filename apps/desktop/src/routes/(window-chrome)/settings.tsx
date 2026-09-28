import { A, type RouteSectionProps } from "@solidjs/router";
import { getVersion } from "@tauri-apps/api/app";
import { createSignal, For, onMount, Suspense } from "solid-js";
import { CapErrorBoundary } from "~/components/CapErrorBoundary";

const pages = [
	["general", "Général"],
	["quality", "Qualité d’enregistrement"],
	["hotkeys", "Raccourcis"],
	["recordings", "Enregistrements"],
	["screenshots", "Captures d’écran"],
	["automations", "Automatisations"],
	["transcription", "Transcription"],
	["license", "À propos et licences"],
];

export default function Settings(props: RouteSectionProps) {
	const [version, setVersion] = createSignal("");
	onMount(() => void getVersion().then(setVersion).catch(console.error));
	return (
		<div class="cap-settings-window flex h-full text-gray-12">
			<aside class="cap-settings-sidebar flex w-56 shrink-0 flex-col border-r border-gray-4 bg-gray-2">
				<div class="cap-settings-window-spacer" data-tauri-drag-region />
				<div class="flex items-center gap-2 px-4 py-5">
					<img src="/brand/app-icon.png" alt="Logo Hi-Ha" class="size-10" />
					<div>
						<p class="text-sm font-semibold">Hi-Ha Record</p>
						<p class="text-xs text-gray-11">Studio de formation</p>
					</div>
				</div>
				<nav class="flex-1 space-y-1 px-2" aria-label="Réglages">
					<For each={pages}>
						{([href, label]) => (
							<A
								href={href}
								class="block rounded-lg px-3 py-2 text-sm hover:bg-gray-3"
								activeClass="bg-gray-4 font-semibold"
							>
								{label}
							</A>
						)}
					</For>
				</nav>
				<div class="space-y-2 p-4 text-xs text-gray-11">
					<p>Version {version()}</p>
					<a
						class="block underline"
						href="https://github.com/sanma88/hi-ha-record/releases"
						target="_blank"
						rel="noreferrer"
					>
						Versions Hi-Ha Record
					</a>
					<a
						class="block underline"
						href="https://github.com/sanma88/hi-ha-record/issues"
						target="_blank"
						rel="noreferrer"
					>
						Signaler un problème
					</a>
				</div>
			</aside>
			<div class="cap-settings-content min-w-0 flex-1 overflow-y-hidden">
				<CapErrorBoundary>
					<Suspense fallback={<p class="p-6">Chargement…</p>}>
						{props.children}
					</Suspense>
				</CapErrorBoundary>
			</div>
		</div>
	);
}
