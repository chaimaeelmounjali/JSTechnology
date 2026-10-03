# ⚡ JavaScript & TypeScript Technology Suite (JSTechnology)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

*Bilingual README: [Français](#-version-française) | [English](#-english-version)*

---

## 🇫🇷 Version Française

### 🎯 Objectif
**JSTechnology** est une suite complète de projets pratiques, code labs et applications modulaires explorant en profondeur l'écosystème **JavaScript**, **TypeScript** et **Node.js**. L'objectif est de maîtriser les paradigmes modernes du développement web côté serveur et client : programmation asynchrone (`async/await`, Promises), consommation d'APIs REST tierces, persistance NoSQL avec MongoDB, typage statique rigoureux avec TypeScript, et sécurisation des routes par sessions Express.

### 🛠️ Stack Technologique
- **Langages** : JavaScript (ES6+), TypeScript, HTML5.
- **Environnement & Runtime** : Node.js, npm, CommonJS.
- **Backend & APIs** : Express.js, `express-session` (authentification par session et cookies de session).
- **Base de Données** : MongoDB avec ODM Mongoose (schémas, typage et validation).
- **Frontend** : TypeScript compilé en JavaScript standard, Tailwind CSS (CDN), DOM dynamique.
- **CLI & Outils** : Inquirer.js (prompts interactifs CLI), module natif `node:https`.
- **Rapports & Spécifications** : `rapport_booktracker.pdf`.

### 👩‍💻 Mon Rôle & Contributions
- **Conception & Architecture globale** :
  - Structuration modulaire des projets avec découpage strict des responsabilités (routage, contrôleurs, modèles).
- **Projet 1 : CLI Pokemon Battle (`NodeJSPoki/pokemon-battle`)** :
  - Développement d'un jeu de combat au tour par tour en ligne de commande interrogeant l'API publique PokéAPI.
  - Implémentation du moteur de combat : gestion des points de vie (PV), points de pouvoir (PP), calcul probabiliste des dégâts et précision.
- **Projet 2 : Book Tracker Fullstack (`book-tracker`)** :
  - Conception d'une application web complète de suivi de lecture avec persistance MongoDB.
  - Typage fort avec TypeScript (`Book.ts`, enums `Status` et `Format`), validation client/serveur et calcul dynamique de la progression de lecture.
- **Projet 3 : API Sécurisée Books Express (`booksExpress/books`)** :
  - Développement d'une API REST protégée par middleware d'authentification basé sur les sessions (`express-session`).

### 📊 Résultats & Métriques Clés
- **3 architectures complémentaires livrées** : un outil CLI interactif consommant une API externe, une application full-stack TypeScript + Express + MongoDB, et une API REST sécurisée avec sessions.
- **Fiabilité et typage statique** : 100% du code Book Tracker validé par le compilateur TypeScript (`tsc`), éliminant les erreurs d'exécution courantes.
- **Documentation et livrable académique** : Intégration d'un rapport technique détaillé (`rapport_booktracker.pdf`).

---

## 🇬🇧 English Version

### 🎯 Objective
**JSTechnology** is a modular hands-on engineering lab and practical project portfolio covering the modern **JavaScript**, **TypeScript**, and **Node.js** ecosystem. It provides practical implementations bridging server-side and browser runtimes: asynchronous flow orchestration (`async/await`), third-party REST API integration, NoSQL persistence with MongoDB & Mongoose, compile-time type safety via TypeScript, and session-based access control.

### 🛠️ Tech Stack
- **Languages**: JavaScript (ES6+), TypeScript, HTML5.
- **Runtime & Environment**: Node.js, npm, CommonJS modules.
- **Backend Framework**: Express.js, `express-session` (cookie session management).
- **Database & ODM**: MongoDB with Mongoose (schemas, model validation, CRUD operations).
- **Frontend**: TypeScript compiled to Vanilla JS, Tailwind CSS, dynamic DOM manipulation.
- **CLI & Protocols**: Inquirer.js, native `node:https`.
- **Documentation**: Comprehensive report included (`rapport_booktracker.pdf`).

### 👩‍💻 My Role & Key Contributions
- **End-to-End System Design**:
  - Engineered clean project structures isolating routing, domain services, and database layers.
- **Project 1: Interactive Pokemon Battle CLI (`NodeJSPoki/pokemon-battle`)**:
  - Built an asynchronous command-line battle simulator consuming PokéAPI endpoints.
  - Coded game mechanics: turn-based bot opponent, move accuracy checks, PP counters, and ANSI color rendering.
- **Project 2: Fullstack Book Tracker (`book-tracker`)**:
  - Developed a fullstack reading log application backed by MongoDB.
  - Modeled strict domain structures with TypeScript (`Book.ts`), client-side and server-side validation schemas, and real-time reading progress analytics.
- **Project 3: Authenticated Books API (`booksExpress/books`)**:
  - Engineered a REST API secured by session middleware, intercepting unauthorized requests on protected endpoints.

### 📊 Key Results & Impact
- **Comprehensive Full-Stack Showcase**: Three complementary projects covering CLI utilities, REST microservices, and end-to-end web apps.
- **Type Safety Guarantee**: Zero runtime schema exceptions in Book Tracker due to strict TypeScript compilation.
- **Documented Architecture**: Accompanied by full analytical writeups (`rapport_booktracker.pdf`).

---

### 📂 Repository Structure / Structure du Projet
```text
JSTechnology/
├── NodeJSPoki/
│   └── pokemon-battle/   # Interactive Pokémon CLI battle game
├── book-tracker/         # Fullstack TypeScript + Express + MongoDB web app
├── booksExpress/
│   └── books/            # Express REST API with session-based auth
├── package.json          # Root workspace configuration
├── tsconfig.json         # Root TypeScript compiler options
└── rapport_booktracker.pdf
```

### 🚀 Getting Started / Démarrage

#### 1. Pokemon Battle CLI
```bash
cd NodeJSPoki/pokemon-battle
npm install
npm start
```

#### 2. Book Tracker (Fullstack)
```bash
cd book-tracker
npm install
npx tsc
node server/server.js
# Open http://localhost:3000 (Requires local MongoDB instance)
```

#### 3. Books Express API
```bash
cd booksExpress/books
npm install
npm start
# Server starts on http://localhost:8080 (Auth credentials: admin / admin)
```
