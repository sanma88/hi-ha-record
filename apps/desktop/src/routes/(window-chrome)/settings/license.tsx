import licenseText from "../../../../../../LICENSE?raw";
import noticeText from "../../../../../../NOTICE.md?raw";
import { Section, SectionCard, SettingsPageContent } from "./Setting";

export default function LegalSettings() {
	return (
		<div class="flex flex-col h-full custom-scroll text-gray-12">
			<SettingsPageContent>
				<div class="flex items-center gap-4">
					<img src="/brand/app-icon.png" alt="Logo Hi-Ha" class="size-16" />
					<div>
						<h1 class="text-xl font-semibold">Hi-Ha Record</h1>
						<p class="text-sm text-gray-11">Votre studio de formation.</p>
					</div>
				</div>
				<Section
					title="À propos et licences"
					description="Version indépendante de Cap, adaptée par Hi-Ha."
				>
					<SectionCard padded>
						<p class="text-sm leading-relaxed">
							Enregistrement, montage et export local utilisables à titre
							personnel ou professionnel, y compris pour des formations
							payantes. Aucun abonnement ni clé de licence commerciale Hi-Ha
							Record n’est nécessaire.
						</p>
						<p class="mt-3 text-sm leading-relaxed">
							Vos vidéos ne sont pas soumises à l’AGPL du seul fait de leur
							enregistrement. Les services cloud tiers ne sont pas inclus dans
							cette application.
						</p>
					</SectionCard>
				</Section>
				<Section title="Crédits et droits">
					<SectionCard padded>
						<p class="text-sm">
							Copyright © 2023–présent Cap Software, Inc. et contributeurs.
							Adaptations Hi-Ha : 2026. Ce projet n’est ni édité ni approuvé par
							Cap Software, Inc.
						</p>
						<p class="mt-3 text-sm">
							Logiciel sous GNU AGPLv3, avec composants MIT et composants tiers
							sous leurs licences respectives. Vous pouvez le modifier et le
							redistribuer en respectant ces licences. Fourni sans garantie,
							dans les limites du droit applicable.
						</p>
						<a
							class="block mt-3 text-sm underline"
							href="https://github.com/sanma88/hi-ha-record"
							target="_blank"
							rel="noreferrer"
						>
							Code source et instructions de compilation
						</a>
						<a
							class="block mt-2 text-sm underline"
							href="https://github.com/CapSoftware/Cap"
							target="_blank"
							rel="noreferrer"
						>
							Projet d’origine : Cap
						</a>
					</SectionCard>
				</Section>
				<details class="rounded-xl border border-gray-4 p-4">
					<summary class="cursor-pointer font-medium">
						Lire la licence AGPLv3
					</summary>
					<pre class="mt-4 whitespace-pre-wrap text-xs leading-relaxed">
						{licenseText}
					</pre>
				</details>
				<details class="rounded-xl border border-gray-4 p-4">
					<summary class="cursor-pointer font-medium">
						Lire les notices et attributions
					</summary>
					<pre class="mt-4 whitespace-pre-wrap text-xs leading-relaxed">
						{noticeText}
					</pre>
				</details>
			</SettingsPageContent>
		</div>
	);
}
