# JSTechnology

Collection de travaux pratiques, de code labs et de mini-projets consacrés à l’écosystème JavaScript. Le dépôt met en pratique Node.js, Express, TypeScript, les API HTTP, la gestion des sessions et la persistance MongoDB à travers des projets progressifs et concrets.

## Objectif

L’objectif de ce repository est de consolider les fondamentaux du développement JavaScript côté serveur et côté navigateur :

- structurer une application Node.js avec des modules CommonJS ;
- consommer une API externe et gérer l’asynchronisme avec les Promises et `async/await` ;
- construire des API REST avec Express ;
- manipuler et valider des données avec TypeScript ;
- gérer une authentification par session ;
- connecter une application à MongoDB avec Mongoose ;
- réaliser des interfaces web interactives et des applications CLI.

## Projets inclus

### 1. `NodeJSPoki/pokemon-battle`

Jeu de combat Pokémon en ligne de commande.

**Fonctionnalités principales :**

- sélection interactive du Pokémon avec Inquirer ;
- récupération des Pokémon et de leurs attaques depuis PokéAPI ;
- combat au tour par tour contre un bot ;
- gestion des PV, PP, précision, attaques bloquées et dégâts variables ;
- affichage terminal avec couleurs ANSI et possibilité de rejouer.

**Organisation technique :**

- `index.js` : boucle principale et interactions CLI ;
- `api.js` : appels HTTP avec le module natif `node:https` ;
- `game.js` : construction des Pokémon et règles du combat ;
- `display.js` : rendu du statut et des résultats dans le terminal.

### 2. `book-tracker`

Application web de suivi de lectures, composée d’une interface TypeScript et d’une API Express connectée à MongoDB.

**Fonctionnalités principales :**

- ajout de livres avec titre, auteur, format, prix et nombre de pages ;
- suivi du statut de lecture et du nombre de pages lues ;
- calcul de la progression et du nombre total de pages ;
- recherche par titre ou auteur ;
- modification et suppression d’un livre ;
- validation des données côté client et côté serveur.

**Organisation technique :**

- `src/Book.ts` : modèle TypeScript, enums `Status` et `Format`, calcul de progression ;
- `src/index.ts` : logique de l’interface, appels à l’API et rendu dynamique ;
- `server/server.js` : serveur Express, routes CRUD et schéma Mongoose ;
- `index.html` : interface responsive avec Tailwind CSS via CDN ;
- `dist/` : fichiers générés par la compilation TypeScript.

### 3. `booksExpress/books`

API Express dédiée à la gestion de livres et à l’apprentissage de l’authentification par session.

**Fonctionnalités principales :**

- connexion et déconnexion avec `express-session` ;
- vérification du statut d’authentification ;
- protection des routes `/books` par middleware ;
- consultation d’un livre ou de la liste complète ;
- ajout d’un livre avec validation minimale ;
- stockage temporaire des livres en mémoire.

Les identifiants de démonstration prévus par l’exercice sont `admin / admin`.

## Stack technique

- **Langages :** JavaScript, TypeScript, HTML ;
- **Runtime :** Node.js ;
- **Backend :** Express.js ;
- **Base de données :** MongoDB avec Mongoose pour `book-tracker` ;
- **Frontend :** HTML, TypeScript compilé en JavaScript, Tailwind CSS via CDN ;
- **CLI :** Inquirer ;
- **API externe :** PokéAPI ;
- **Authentification :** sessions Express avec `express-session` ;
- **Modules :** CommonJS (`require` / `module.exports`) et modules locaux.

## Mon rôle

J’ai conçu et implémenté les différents exercices du repository de bout en bout :

- définition de la structure des projets et des modules ;
- développement de la logique métier des jeux et applications ;
- intégration de PokéAPI et traitement des réponses asynchrones ;
- création des routes Express et des middlewares de protection ;
- modélisation et validation des livres avec TypeScript et Mongoose ;
- développement de l’interface Book Tracker et de ses interactions ;
- gestion des erreurs, des validations utilisateur et des cas limites ;
- rédaction de la documentation spécifique du projet Pokémon.

## Résultats

Ce repository aboutit à trois implémentations fonctionnelles et complémentaires :

- un jeu CLI interactif utilisant une API publique ;
- une application complète de suivi de lectures avec frontend, API REST et MongoDB ;
- une API Express protégée par authentification de session.

Ces réalisations démontrent la capacité à passer d’un script Node.js modulaire à une application web full-stack, tout en appliquant des notions de séparation des responsabilités, validation des données, programmation asynchrone et conception d’API.

## Installation et exécution

Chaque projet possède son propre environnement Node.js et doit être installé séparément.

### Pokémon Battle CLI

```bash
cd NodeJSPoki/pokemon-battle
npm install
npm start
```

Une connexion Internet est nécessaire pour interroger PokéAPI.

### Book Tracker

```bash
cd book-tracker
npm install
npx tsc
node server/server.js
```

L’application utilise MongoDB en local avec la base `booktracker` et démarre sur `http://localhost:3000`.

### Books Express

```bash
cd booksExpress/books
npm install
npm start
```

L’API démarre sur `http://localhost:8080`. Il faut d’abord appeler `POST /auth/login` avec les identifiants `admin / admin` avant d’accéder aux routes `/books`.

## Structure du repository

```text
JSTechnology/
├── NodeJSPoki/
│   └── pokemon-battle/   # Jeu Pokémon interactif en CLI
├── book-tracker/         # Application web TypeScript + Express + MongoDB
├── booksExpress/
│   └── books/            # API Express avec authentification par session
├── package.json          # Configuration Node.js à la racine
├── tsconfig.json         # Configuration TypeScript
└── rapport_booktracker.pdf
```

## Limites et pistes d’amélioration

- ajouter une suite de tests automatisés pour les routes Express et la logique de combat ;
- déplacer les URLs, ports et chaînes sensibles dans des variables d’environnement ;
- remplacer l’authentification de démonstration par une gestion sécurisée des utilisateurs ;
- utiliser un stockage persistant pour `booksExpress` ;
- améliorer la gestion centralisée des erreurs et des états de chargement côté frontend ;
- éviter de versionner les répertoires `node_modules` et conserver uniquement les fichiers nécessaires au projet.
