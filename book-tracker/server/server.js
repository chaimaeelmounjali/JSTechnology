const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const STATUS_VALUES = [
  "Read",
  "Re-read",
  "DNF",
  "Currently reading",
  "Returned Unread",
  "Want to read"
];

const FORMAT_VALUES = ["Print", "PDF", "Ebook", "AudioBook"];

const webRoot = path.join(__dirname, "..");
app.use(express.static(webRoot));

app.get("/", (req, res) => {
  res.sendFile(path.join(webRoot, "index.html"));
});

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/booktracker");


// Schema MongoDB
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  numberOfPages: { type: Number, required: true, min: 1 },
  status: { type: String, required: true, enum: STATUS_VALUES },
  price: { type: Number, min: 0, default: 0 },
  pagesRead: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return value <= this.numberOfPages;
      },
      message: "pagesRead must be <= numberOfPages"
    }
  },
  format: { type: String, required: true, enum: FORMAT_VALUES },
  suggestedBy: { type: String, default: "", trim: true },
  finished: { type: Number, enum: [0, 1], default: 0 }
});

const Book = mongoose.model("Book", bookSchema);

// Routes
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/books", async (req, res) => {
  try {
    const data = req.body;
    const numberOfPages = Number(data.numberOfPages);
    const status = data.status;
    const pagesRead = status === "Read" ? numberOfPages : Number(data.pagesRead);

    if (!Number.isFinite(numberOfPages) || numberOfPages <= 0) {
      return res.status(400).json({ error: "numberOfPages must be >= 1" });
    }

    if (!Number.isFinite(pagesRead) || pagesRead < 0) {
      return res.status(400).json({ error: "pagesRead must be >= 0" });
    }

    if (pagesRead > numberOfPages) {
      return res.status(400).json({ error: "pagesRead must be <= numberOfPages" });
    }

    data.numberOfPages = numberOfPages;
    data.pagesRead = pagesRead;
    data.finished = pagesRead === numberOfPages ? 1 : 0;
    if (pagesRead === numberOfPages) {
      data.status = "Read";
    }

    const book = new Book(data);
    await book.save();
    res.json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid book data";
    res.status(400).json({ error: message });
  }
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const hasPagesRead = req.body.pagesRead !== undefined;
    const hasStatus = req.body.status !== undefined;
    let pagesRead = book.pagesRead;
    let status = book.status;

    if (hasPagesRead) {
      const nextPagesRead = Number(req.body.pagesRead);

      if (!Number.isFinite(nextPagesRead) || nextPagesRead < 0) {
        return res.status(400).json({ error: "pagesRead must be >= 0" });
      }

      if (nextPagesRead > book.numberOfPages) {
        return res.status(400).json({ error: "pagesRead must be <= numberOfPages" });
      }
      pagesRead = nextPagesRead;
    }

    if (hasStatus) {
      if (!STATUS_VALUES.includes(req.body.status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      status = req.body.status;
    }

    if (status === "Read" || pagesRead === book.numberOfPages) {
      pagesRead = book.numberOfPages;
      status = "Read";
      book.finished = 1;
    } else {
      book.finished = pagesRead === book.numberOfPages ? 1 : 0;
    }

    book.pagesRead = pagesRead;
    book.status = status;

    await book.save();
    res.json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid book data";
    res.status(400).json({ error: message });
  }
});

app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));