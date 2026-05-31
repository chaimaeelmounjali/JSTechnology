# 🎮 Pokémon Battle CLI — TP Node.js

Mini jeu de combat Pokémon en ligne de commande, développé avec Node.js.

---

## 📦 Installation

```bash
# 1. Installer les dépendances npm
npm install

# 2. Lancer le jeu
npm start
# ou
node index.js
```

---

## 🕹️ Règles du jeu

| Règle | Description |
|-------|-------------|
| **PV** | Chaque Pokémon commence avec **300 PV** |
| **Attaques** | Jusqu'à **5 attaques** de dégâts par Pokémon |
| **PP** | Chaque attaque a un nombre limité d'utilisations (PP) |
| **Blocage PP** | Si vos PP < PP ennemis → votre attaque est bloquée |
| **Précision** | Chaque attaque peut rater selon sa précision |
| **Dégâts** | Dépendent de la puissance (PWR) ± 15% de variance |
| **Bot** | Choisit ses attaques aléatoirement |
| **Victoire** | Le premier Pokémon à 0 PV perd |

---

## 🗂️ Structure du projet

```
pokemon-battle/
│
├── index.js      → Point d'entrée : boucle de jeu + prompts inquirer
├── api.js        → Appels PokeAPI avec le module natif node:https
├── game.js       → Logique de combat (buildPokemon, executeTurn)
├── display.js    → Affichage terminal (barres PV, couleurs ANSI)
└── package.json  → Configuration npm
```

---

## 📚 Concepts du cours utilisés

| Concept cours | Utilisation dans le projet |
|--------------|---------------------------|
| **Module natif `https`** | `api.js` — Appels à `pokeapi.co` sans fetch ni axios |
| **CommonJS** | `require()` / `module.exports` dans chaque fichier |
| **Modules locaux** | `api`, `game`, `display` importés dans `index.js` |
| **Module tiers npm** | `inquirer@8` pour les menus interactifs en terminal |
| **Async / Await** | Toutes les fonctions API et la boucle de jeu |
| **Promises** | `Promise.all()` pour charger les attaques en parallèle |
| **npm scripts** | `npm start` → `node index.js` |
| **CLI** | `#!/usr/bin/env node` en tête de `index.js` |
| **Events** | Événements `data`, `end`, `error` du stream `https.get` |

---

## 🌐 API utilisée

**PokéAPI** — https://pokeapi.co (gratuite, sans clé)

- `GET /api/v2/pokemon?limit=50` — Liste des Pokémon
- `GET /api/v2/pokemon/{name}` — Données d'un Pokémon
- `GET /api/v2/move/{id}` — Données d'une attaque (puissance, PP, précision)
