# Suivi de Hi-Ha Record

## Provenance

- Amont : https://github.com/CapSoftware/Cap
- Base : `20c224073bece3fbebed8acb631bd2df97cd6f40`
- Fork : https://github.com/sanma88/hi-ha-record
- Identité graphique : https://github.com/sanma88/hiha-voice-macos
- Révision graphique : `192e1492f1991dfa030bccbc070a97d7787914fc`

## Adaptations du 28 septembre 2026

- Nom Hi-Ha Record, icône Mac et menu, symbole cheval et signature visuelle.
- Palette Hi-Ha Voice, police Inter embarquée, thèmes clair et sombre.
- Identifiants, protocole de liens et journaux propres à cette application.
- Page À propos et licences : AGPLv3 complète accessible hors ligne, attributions, garantie, usage professionnel et lien vers les sources.
- Notices et licences ajoutées aux ressources à embarquer.
- Suppression de l’activation des clés, des statuts commerciaux et des liens d’achat dans l’interface desktop. Les anciennes données de licence peuvent encore être lues pour compatibilité du format de stockage, mais elles ne donnent plus de droits dans le code natif.
- Les demandes d’achat héritées ouvrent les mentions légales. Les autorisations des services cloud externes restent vérifiées côté serveur ; aucun statut Pro fictif n’est créé.
- Sélecteur principal limité à Studio et captures d’écran ; Studio par défaut.
- Mises à jour Cap neutralisées côté configuration et côté vérification native.
- Bascule vers l’application GPUI amont désactivée : son interface distincte n’a pas été adaptée.

## Validation

- Dépendances frontend installées avec Bun 1.4.2, sans scripts d’installation ; version déclarée amont : 1.4.0.
- Biome sur les fichiers TS/TSX/JS/JSON/CSS modifiés.
- TypeScript : `tsc --noEmit -p apps/desktop/tsconfig.json`.
- Compilation frontend : `bun run --cwd apps/desktop build`.
- Formatage natif : `cargo fmt --all`, avec Rust 1.88.0 installé dans un répertoire temporaire.
- Aperçus clair/sombre de la page légale compilée : ressources chargées, aucun appel réseau externe observé pour cette page, appels Tauri simulés dans un navigateur de test.
- Licence principale et licence MIT conservées intégralement.
- Icône ICNS construite à partir des PNG inchangés de Hi-Ha Voice ; lecture 1024 × 1024 vérifiée avec les outils macOS.

La compilation native optimisée a réussi avec Xcode 27.0, Rust 1.88.0 et CMake 3.31.10 sur Apple Silicon. Les outils d’export et le moteur Whisper ont également été compilés. Les six tests du sélecteur de compilation GPUI passent ; cette édition exclut GPUI de la compilation et du paquet. Les notices ONNX sont copiées par la préparation et incluses dans les ressources. L’application obtenue porte l’identifiant `be.hi-ha.record`, est arm64 et sa signature ad hoc passe `codesign --verify --deep --strict`. Les licences AGPL, MIT, Inter et ONNX sont présentes dans les ressources. L’assemblage non interactif produit l’application et un DMG local ; le fond d’installateur portant la marque Cap est retiré. Voir [BUILDING.md](BUILDING.md).

## Avant un installateur

1. Vérifier le paquet produit et sa signature pour le mode de distribution choisi.
2. Tester réellement capture écran, microphone, caméra, montage, export et permissions sur macOS.
3. Vérifier les intégrations facultatives et leurs liens de retour : aucun service cloud Hi-Ha n’est déployé.
4. Compléter l’inventaire des licences des composants effectivement embarqués et les notices correspondantes.
5. Signer, notarier et publier le binaire avec ses sources exactes et instructions de construction.

Les workflows GitHub Actions sont hérités de Cap et ne constituent pas encore une chaîne de livraison Hi-Ha. Les examiner avant activation. Les sources web, CLI et GPUI amont restent dans le monorepo ; cette adaptation concerne l’application desktop Tauri sur Mac.

## Indépendance des services — version 0.6.1

- API cloud et connexion de compte désactivées, même en présence d’un ancien serveur configuré.
- Initialisation Sentry et export OpenTelemetry retirés ; collecteurs frontend et natif désactivés indépendamment des variables de compilation.
- Permission HTTP générique de la webview retirée et CSP réseau resserrée.
- Export limité au fichier et au presse-papiers ; assistant initial limité aux permissions.
- Modèles Whisper et Parakeet téléchargés depuis leurs distributeurs indépendants, sur des révisions figées. Les empreintes des quatre fichiers ONNX Parakeet principaux correspondent à celles du miroir antérieur.
- Liens de support et téléchargement dirigés vers le dépôt Hi-Ha ; mentions visibles restantes hors attribution corrigées.
- Le DMG 0.6.0 précédent ne contient pas ces changements.

Validation 0.6.1 : vérification Rust de `cap-desktop` et `cap`, TypeScript desktop et Biome ciblé réussis. Trois tests de non-régression vérifient l’absence de requête cloud et d’initialisation de la télémétrie malgré une configuration héritée. L’inspection des fichiers JavaScript compilés ne trouve les adresses Cap que dans les modules légaux ; la page légale rendue avec Tauri simulé ne déclenche aucun appel externe. Ces contrôles ne constituent pas un test réseau complet de l’application native.
