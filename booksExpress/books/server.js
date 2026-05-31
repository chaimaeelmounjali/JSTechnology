const express = require("express");
const session = require("express-session");
const booksRouter = require("./books");

const app = express();
const PORT = 8080;

// ─── Middlewares globaux ───────────────────────────────────────────────────────

// express.json()        → parse les bodies avec Content-Type: application/json
// express.urlencoded()  → parse les bodies avec Content-Type: application/x-www-form-urlencoded
// Le type: '*/*' permet de parser MEME si Content-Type est absent ou "Text" (cas Postman)
app.use(express.json({ type: ["application/json", "text/plain", "*/*"] }));
app.use(express.urlencoded({ extended: true }));

// Middleware de log global (cours slide 17)
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  console.log("Body:", req.body);
  next();
});

// Configuration des sessions (après les body parsers)
app.use(
  session({
    secret: "ADEDUIQDSKLFDSKQMLDKFSDKFLDSMQK",
    resave: false,
    saveUninitialized: false,
  })
);

// ─── Middleware de protection ──────────────────────────────────────────────────

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Accès refusé. Veuillez vous connecter." });
  }
};

// ─── Routes d'authentification ────────────────────────────────────────────────

/**
 * POST /auth/login
 * Body : { "username": "admin", "password": "admin" }
 * Dans Postman : Body → raw → JSON (pas Text !)
 */
app.post("/auth/login", (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Body vide ou mal formaté.",
      solution: "Dans Postman : Body → raw → changer 'Text' en 'JSON'",
      exemple: '{ "username": "admin", "password": "admin" }',
    });
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "username et password sont obligatoires." });
  }

  // Fake auth : seul admin/admin est accepté (comme demandé dans l'exercice)
  if (username === "admin" && password === "admin") {
    req.session.user = { username };
    res.status(200).json({ message: `Bienvenue ${username} ! Vous êtes connecté.` });
  } else {
    res.status(401).json({ message: "Identifiants incorrects. Utilisez admin / admin" });
  }
});

/**
 * POST /auth/logout
 */
app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion." });
    res.status(200).json({ message: "Déconnexion réussie." });
  });
});

/**
 * GET /auth/status
 */
app.get("/auth/status", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ authenticated: false });
  }
});

// ─── Router Books (protégé) ───────────────────────────────────────────────────

app.use("/books", isAuthenticated, booksRouter);

// ─── Route d'accueil ──────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "API Express.js - Exercice Sessions",
    routes: {
      auth: {
        "POST /auth/login":  "Se connecter (username: admin, password: admin)",
        "POST /auth/logout": "Se déconnecter",
        "GET /auth/status":  "Vérifier le statut d'authentification",
      },
      books: {
        "GET /books":       "Lister tous les livres (auth requise)",
        "GET /books/:id":   "Récupérer un livre par id (auth requise)",
        "POST /books":      "Ajouter un livre (auth requise)",
      },
    },
  });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Running Express server on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});