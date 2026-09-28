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

Le script de préparation télécharge les bibliothèques multimédias et ONNX dans `target/native-deps`, prépare leur signature locale et génère `.cargo/config.toml`. Les notices ONNX sont jointes au paquet. Le hook avant assemblage signe également la bibliothèque ONNX avec `APPLE_SIGNING_IDENTITY` et ajoute un horodatage sécurisé pour une identité Developer ID. La compilation Hi-Ha exclut GPUI, dont l’interface amont n’est pas utilisée dans cette édition.

`APPLE_SIGNING_IDENTITY=-` demande une signature ad hoc pour un essai local. Elle n’est ni une signature Developer ID ni une notarisation Apple. Aucun secret Apple n’est nécessaire pour ce premier assemblage.

La première compilation peut être longue : elle construit les outils d’export et leurs dépendances, puis l’application Tauri. Les exécutions suivantes utilisent le cache Cargo.

Les résultats se trouvent dans `target/release/bundle/`, ou sous `target/<cible>/release/bundle/` lorsqu’une cible est passée explicitement.

## Distribution

Avant de partager publiquement un installateur : effectuer les tests d’enregistrement et d’export sur macOS, vérifier les notices des dépendances embarquées, signer avec un certificat Developer ID valide et notarier. Fournir les sources exactes correspondant au binaire et leurs instructions de construction, conformément aux licences applicables.

Les fichiers `.env`, certificats privés, clés et enregistrements ne doivent pas être ajoutés au dépôt.

## Signature Developer ID et notarisation

Importer dans le trousseau session le certificat Developer ID Application du mainteneur **avec sa clé privée**. Vérifier sa présence avec `security find-identity -v -p codesigning`. Ne pas utiliser un certificat Apple Distribution destiné au Mac App Store pour le DMG direct.

```sh
APPLE_SIGNING_IDENTITY="Developer ID Application: NOM (TEAMID)" bun run tauri:build --ci
```

Configurer un profil de notarisation local ; la commande demande le mot de passe pour application de façon interactive :

```sh
xcrun notarytool store-credentials "HiHaRecord-notary" --apple-id "ADRESSE_APPLE" --team-id "TEAMID"
xcrun notarytool submit "target/release/bundle/dmg/Hi-Ha Record_0.6.1_aarch64.dmg" --keychain-profile "HiHaRecord-notary" --wait
xcrun stapler staple "target/release/bundle/dmg/Hi-Ha Record_0.6.1_aarch64.dmg"
xcrun stapler validate "target/release/bundle/dmg/Hi-Ha Record_0.6.1_aarch64.dmg"
```

N’exécuter les étapes de stapling qu’après un statut Apple `Accepted`. Ne pas ajouter de mot de passe dans la ligne de commande, le dépôt ou les journaux.

## Autorisations cochées mais non reconnues

Après le remplacement d’une version signée ad hoc par une version Developer ID, macOS peut conserver une entrée d’autorisation obsolète. Si Accessibilité ou Enregistrement de l’écran reste refusé malgré une case activée et un redémarrage :

1. Quitter Hi-Ha Record.
2. Dans Réglages Système → Confidentialité et sécurité, ouvrir l’autorisation concernée.
3. Retirer uniquement l’entrée Hi-Ha Record, puis ajouter à nouveau `/Applications/Hi-Ha Record.app` avec le bouton `+`.
4. Activer l’autorisation et relancer l’application.

Cette procédure a rétabli les deux autorisations sur le Mac de validation. Elle ne nécessite pas de réinitialiser les autorisations des autres applications. La version 0.6.2 rafraîchit aussi l’état pendant l’écran d’autorisations et au retour de la fenêtre, sans multiplier les vérifications natives simultanées.

## Assemblage alternatif du DMG

Si `bundle_dmg.sh` échoue après signature de l’application, créer une image à partir du paquet signé. Employer un nouveau répertoire temporaire et adapter la version du nom de sortie :

```sh
image_dir=$(mktemp -d)
ditto "target/release/bundle/macos/Hi-Ha Record.app" "$image_dir/Hi-Ha Record.app"
ln -s /Applications "$image_dir/Applications"
hdiutil create -volname "Hi-Ha Record" -srcfolder "$image_dir" -format UDZO "Hi-Ha-Record-0.6.2-arm64.dmg"
codesign --force --sign "Developer ID Application: NOM (TEAMID)" --timestamp "Hi-Ha-Record-0.6.2-arm64.dmg"
xcrun notarytool submit "Hi-Ha-Record-0.6.2-arm64.dmg" --keychain-profile "HiHaRecord-notary" --wait
```

Après un statut `Accepted`, joindre le ticket avec `xcrun stapler staple`, le vérifier avec `xcrun stapler validate`, puis vérifier Gatekeeper. Calculer le SHA-256 uniquement après le stapling. Ne pas modifier le contenu de l’application après sa signature.
