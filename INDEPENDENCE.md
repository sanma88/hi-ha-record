# Services et identité de Hi-Ha Record

L’édition desktop 0.6.1 est destinée à l’enregistrement, au montage et à l’export local. Elle n’utilise ni compte Cap, ni abonnement, ni serveur de partage Cap. Aucune clé de licence commerciale n’est nécessaire.

## Connexions

La connexion au cloud est refusée avant l’envoi des requêtes authentifiées ; les autres URL de l’API sont dirigées vers un protocole local non HTTP. Les anciens réglages de serveur ne réactivent pas l’API dans l’édition Hi-Ha. La webview ne possède plus de permission HTTP générique. Le CLI cloud autonome est exclu du paquet ; le worker d’export refuse les commandes cloud et les fonctions d’installation de l’ancien CLI sont désactivées. Les SDK de télémétrie frontend, Sentry et OpenTelemetry ne sont pas initialisés ; le collecteur natif ne possède aucun identifiant actif.

Les seuls téléchargements de modèles configurés dans le moteur de sous-titres utilisent :

- [whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp), révision `5359861c739e955e79d9a303bcbc70fb988958b1` ;
- [parakeet-rs](https://huggingface.co/altunenes/parakeet-rs), révision `4d2a8bc71f5c896ec40faa59732e6716295edaf2`, dossier `tdt`.

Ces modèles sont téléchargés à la demande. Les enregistrements ne leur sont pas envoyés : le traitement est local. Les boutons de support et de versions ouvrent le dépôt GitHub Hi-Ha dans le navigateur.

## Mentions conservées

Le copyright Cap Software, la provenance du code, les licences AGPL et MIT, ainsi que les notices tierces sont conservés. Les noms internes historiques de crates, de formats `.cap` et certains identifiants techniques restent pour la compatibilité du code et des projets. Ils ne sont pas une connexion à un service Cap. Le monorepo contient aussi les sources amont web et GPUI, qui ne sont pas distribuées comme une offre Hi-Ha.

Les dépendances de compilation restent traçables vers leurs dépôts d’origine ; un checkout ou une compilation peut donc télécharger du code amont. Cette provenance est distincte du fonctionnement de l’application installée.

## Signature

La signature ad hoc du premier DMG 0.6.0 n’utilisait pas de compte Apple. Une version distribuée sous l’identité du mainteneur doit être signée avec son certificat Developer ID Application et sa clé privée, puis soumise à Apple pour notarisation. La clé privée et les justificatifs de notarisation restent hors du dépôt.

La compilation et les contrôles de source ne remplacent pas les essais réels de capture, d’export et d’observation réseau sur macOS.
