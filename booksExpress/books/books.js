const express = require("express");
const router = express.Router();

// ─── Données en mémoire (variable globale comme dans le cours) ────────────────

let booksList = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999 },
  { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", year: 2015 },
];

// ─── Middleware spécifique à ce router ───────────────────────────────────────

// Ce middleware est propre au router books (comme dans le cours avec birds.js)
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log(`[Books Router] ${req.method} ${req.url} — User: ${req.session.user.username}`);
  next();
});

// ─── GET /books ───────────────────────────────────────────────────────────────

/**
 * Lister tous les livres
 * Accessible uniquement si l'utilisateur est authentifié (vérifié dans server.js)
 */
router.get("/", (req, res) => {
  res.status(200).json(booksList);
});

// ─── GET /books/:id ───────────────────────────────────────────────────────────

/**
 * Récupérer un livre par son ID (route parameter comme dans le cours)
 * Exemple : GET /books/1
 */
router.get("/:id", (req, res) => {
  const { id } = req.params; // req.params comme dans le cours
  const book = booksList.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ message: `Livre avec l'id ${id} introuvable.` });
  }

  res.status(200).json(book);
});

// ─── POST /books ──────────────────────────────────────────────────────────────

/**
 * Ajouter un nouveau livre
 * Body attendu : { title: "...", author: "...", year: ... }
 * Retourne 201 (création réussie) comme montré dans le cours
 */
router.post("/", (req, res) => {
  console.log(req.body); // Comme dans le cours

  const { title, author, year } = req.body;

  // Validation simple
  if (!title || !author) {
    return res.status(400).json({ message: "Les champs 'title' et 'author' sont obligatoires." });
  }

  // Création du nouvel objet livre
  const newBook = {
    id: booksList.length + 1,
    title,
    author,
    year: year || null,
  };

  // Ajout dans la liste (comme groceryList.push(req.body) dans le cours)
  booksList.push(newBook);

  // 201 = création réussie (comme dans le cours)
  res.sendStatus(201);
});

// ─── Export du router ─────────────────────────────────────────────────────────

module.exports = router;