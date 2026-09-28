# Compiler Hi-Ha Record sur Mac

## Prérequis

- Mac Apple Silicon pour la première version validée ici.
- Xcode complet, avec sa configuration initiale terminée.
- Rust 1.88.0, fixé par `rust-toolchain.toml`, et Cargo dans le PATH.
- Node.js 20+ et Bun (version déclarée : 1.4.0).
- CMake 3.x dans le PATH pour le moteur Whisper (version utilisée : 3.31.10).

Vérifier les outils :

```sh
xcode-select -p
xcodebuild -version
xcodebuild -checkFirstLaunchStatus
cargo --version
bun --version
cmake --version
```

Si Xcode n’est pas sélectionné, `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` peut être défini pour les commandes de compilation sans changer la sélection globale.

## Préparer et compiler

```sh
bun install
bun run cap-setup
APPLE_SIGNING_IDENTITY=- bun run tauri:build --ci
```

Le script de préparation télécharge les bibliothèques multimédias et ONNX dans `target/native-deps`, prépare leur signature locale et génère `.cargo/config.toml`. Les notices ONNX sont jointes au paquet. La compilation Hi-Ha exclut GPUI, dont l’interface amont n’est pas utilisée dans cette édition.

`APPLE_SIGNING_IDENTITY=-` demande une signature ad hoc pour un essai local. Elle n’est ni une signature Developer ID ni une notarisation Apple. Aucun secret Apple n’est nécessaire pour ce premier assemblage.

La première compilation peut être longue : elle construit les outils d’export et leurs dépendances, puis l’application Tauri. Les exécutions suivantes utilisent le cache Cargo.

Les résultats se trouvent dans `target/release/bundle/`, ou sous `target/<cible>/release/bundle/` lorsqu’une cible est passée explicitement.

## Distribution

Avant de partager publiquement un installateur : effectuer les tests d’enregistrement et d’export sur macOS, vérifier les notices des dépendances embarquées, signer avec un certificat Developer ID valide et notarier. Fournir les sources exactes correspondant au binaire et leurs instructions de construction, conformément aux licences applicables.

Les fichiers `.env`, certificats privés, clés et enregistrements ne doivent pas être ajoutés au dépôt.
