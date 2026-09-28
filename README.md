# Hi-Ha. record

Version personnalisée de [Cap](https://github.com/CapSoftware/Cap), destinée à enregistrer et monter des vidéos de formation sur macOS, puis à les exporter localement.

Projet indépendant de Cap Software, Inc. Le nom du projet est **Hi-Ha. record** ; le logiciel amont conserve pour le moment son interface et ses icônes Cap.

## État du projet

Dépôt initialisé le 28 septembre 2026. **Aucune application Hi-Ha. record compilée, signée ou prête à installer n’est encore publiée.**

- Code source de Cap conservé avec son historique GitHub et ses licences.
- Version de départ : [`20c224073bece3fbebed8acb631bd2df97cd6f40`](https://github.com/CapSoftware/Cap/commit/20c224073bece3fbebed8acb631bd2df97cd6f40).
- Aucun changement fonctionnel effectué à ce stade.
- Compilation et essai d’enregistrement encore à effectuer.

Voir [FORK.md](FORK.md) pour la provenance, les vérifications et les étapes restantes. La [documentation amont](README.upstream.md) décrit le fonctionnement de Cap ; ses liens de téléchargement conduisent aux applications officielles de Cap, pas à une version de ce projet.

## Objectif

Enregistrer l’écran, le microphone et éventuellement la caméra pour produire des formations payantes. Le premier objectif est une application Mac avec enregistrement, montage et export local, distribuable directement après signature et notarisation Apple.

Les services hébergés de Cap ne sont pas fournis par ce dépôt. Le code amont comporte encore ses connexions réseau, sa télémétrie, ses liens commerciaux et son système de mise à jour : leur adaptation reste à faire avant de proposer une application indépendante.

## Licence et attribution

Copyright du code d’origine : Cap Software, Inc. et les contributeurs concernés. Les modifications de ce fork sont identifiées dans l’historique Git.

- [AGPLv3](LICENSE) pour le code couvert par la licence principale.
- [MIT](licenses/LICENSE-MIT) pour les familles de crates `cap-camera*` et `scap-*`, selon la licence du dépôt.
- Licences propres aux composants tiers, à conserver et vérifier lors de la préparation des binaires.

La [documentation commerciale de Cap](apps/web/content/docs/commercial-license.mdx) précise que sa licence commerciale concerne les binaires distribués par Cap et ne s’applique pas aux versions compilées soi-même depuis les sources. Ces dernières restent soumises aux licences du code utilisé.

Les vidéos originales enregistrées avec le logiciel ne deviennent pas AGPL du seul fait de leur enregistrement. En cas de partage de l’application, même gratuit, fournir le code source correspondant et respecter les obligations des licences applicables.

## Préparer la compilation

Prérequis annoncés par le projet : Node.js 20+, Bun 1.4.0, Rust (outil fixé à 1.88.0 par `rust-toolchain.toml`) et les outils Apple nécessaires à la compilation macOS. Docker est nécessaire pour la pile web complète ; le besoin exact du parcours local sera vérifié lors de la première compilation.

```sh
git clone https://github.com/sanma88/hi-ha-record.git
cd hi-ha-record
bun install
bun run env-setup
bun run cap-setup
```

La commande amont `bun run tauri:build` construit actuellement **Cap** avec sa configuration de production amont. Elle ne constitue pas encore une procédure de livraison Hi-Ha. record. Le profil de compilation indépendant doit être préparé et testé avant publication d’un installateur.

Ne jamais versionner les fichiers `.env`, les enregistrements personnels, les clés de signature, les certificats privés ou les identifiants Apple. Aucun de ces éléments n’est nécessaire pour consulter ce dépôt.
