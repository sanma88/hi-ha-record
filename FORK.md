# Provenance et suivi du fork

## Base

- Amont : https://github.com/CapSoftware/Cap
- Fork : https://github.com/sanma88/hi-ha-record
- Commit de départ : `20c224073bece3fbebed8acb631bd2df97cd6f40`
- Date de préparation : 2026-09-28
- Plateforme initiale : macOS Apple Silicon.

## Modifications du 28 septembre 2026

- Présentation du projet Hi-Ha. record dans `README.md`.
- Conservation intégrale du README d’origine dans `README.upstream.md`.
- Ajout du présent document de suivi.
- Aucun changement du moteur d’enregistrement, de la licence, des crédits, des dépendances ou des configurations de production.

## Vérifications effectuées

- Lecture de `LICENSE`, des instructions `AGENTS.md` et de la documentation commerciale amont.
- La documentation commerciale distingue explicitement les binaires officiels des versions compilées soi-même.
- Les fichiers de licence restent identiques au commit amont.
- Lecture des configurations Tauri et des commandes de compilation.
- Vérification des prérequis locaux : Mac arm64, Node.js 26.8.1, Bun 1.4.2 présent dans `~/.bun/bin` ; la version Bun déclarée par le projet est 1.4.0.
- Rust/Cargo absent du PATH et du chemin standard `~/.cargo/bin/cargo`.
- `xcodebuild -version` échoue : le répertoire développeur actif contient uniquement les Command Line Tools. Aucun `Xcode*.app` trouvé dans `/Applications`.
- Compilation, signature, notarisation et tests d’enregistrement non effectués.

Cette vérification initiale ne constitue pas un audit exhaustif des licences transitives ou des composants multimédias embarqués. Celui-ci devra porter sur les dépendances réellement utilisées dans le binaire final.

## Étapes avant un premier installateur

1. Installer/configurer Xcode complet et Rust, et utiliser la version Bun attendue.
2. Installer les dépendances et obtenir une compilation reproductible de la base.
3. Créer un profil Hi-Ha. record : nom, identifiant d’application distinct, icône et mentions légales accessibles.
4. Adapter ensemble les protocoles de liens, les chemins de données et les intégrations qui supposent l’identité Cap.
5. Préparer le parcours local ; vérifier les contrôles de licence, les appels réseau, la télémétrie et les liens vers les services Cap.
6. Désactiver les mises à jour officielles de Cap dans le profil indépendant avant toute distribution.
7. Vérifier les licences et notices des composants effectivement embarqués, notamment les composants multimédias.
8. Tester capture écran, microphone, caméra, montage, export et permissions macOS sur un profil de test.
9. Signer et notarier avec le compte Apple du mainteneur, sans placer de secrets dans Git.
10. Publier l’installateur avec les sources correspondantes, les instructions de construction et les notices nécessaires.

## Automatisation

Les workflows GitHub Actions proviennent de Cap. Les examiner avant activation : ils peuvent faire référence à l’infrastructure et aux secrets de l’amont. Aucune chaîne de publication Hi-Ha. record n’a encore été configurée.
