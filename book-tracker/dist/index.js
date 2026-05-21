var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API = "http://localhost:3000";
const STATUS_VALUES = [
    "Read",
    "Re-read",
    "DNF",
    "Currently reading",
    "Returned Unread",
    "Want to read"
];
let allBooks = [];
function loadBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield fetch(`${API}/books`);
        const books = yield res.json();
        allBooks = books;
        const term = (_a = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value) !== null && _a !== void 0 ? _a : "";
        renderBooks(filterBooks(allBooks, term));
    });
}
function addBook(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${API}/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        loadBooks();
    });
}
function updateBook(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield fetch(`${API}/books/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const payload = yield res.json().catch(() => ({}));
            const message = (_a = payload === null || payload === void 0 ? void 0 : payload.error) !== null && _a !== void 0 ? _a : "Erreur de mise a jour.";
            alert(message);
            return;
        }
        loadBooks();
    });
}
function deleteBook(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${API}/books/${id}`, { method: "DELETE" });
        loadBooks();
    });
}
window.deleteBook = deleteBook;
function toggleEdit(id, show) {
    const panel = document.getElementById(`edit-${id}`);
    if (panel) {
        panel.classList.toggle("hidden", !show);
    }
}
function saveEdit(id, numberOfPages) {
    const pagesReadField = document.getElementById(`pagesRead-${id}`);
    const statusField = document.getElementById(`status-${id}`);
    if (!pagesReadField || !statusField) {
        return;
    }
    let pagesRead = parseInt(pagesReadField.value);
    let status = statusField.value;
    if (status === "Read") {
        pagesRead = numberOfPages;
        pagesReadField.value = numberOfPages.toString();
    }
    if (!Number.isFinite(pagesRead) || pagesRead < 0) {
        alert("Les pages lues doivent etre >= 0.");
        return;
    }
    if (pagesRead > numberOfPages) {
        alert("Les pages lues doivent etre <= au nombre de pages.");
        return;
    }
    if (pagesRead === numberOfPages) {
        status = "Read";
        statusField.value = "Read";
    }
    updateBook(id, { pagesRead, status });
    toggleEdit(id, false);
}
window.toggleEdit = toggleEdit;
window.saveEdit = saveEdit;
const numberOfPagesInput = document.getElementById("numberOfPages");
const pagesReadInput = document.getElementById("pagesRead");
const searchInput = document.getElementById("searchInput");
const updatePagesReadLimit = () => {
    const total = parseInt(numberOfPagesInput.value);
    if (Number.isFinite(total) && total > 0) {
        pagesReadInput.max = total.toString();
        const currentPagesRead = parseInt(pagesReadInput.value);
        if (Number.isFinite(currentPagesRead) && currentPagesRead > total) {
            pagesReadInput.value = total.toString();
        }
    }
    else {
        pagesReadInput.removeAttribute("max");
    }
};
numberOfPagesInput.addEventListener("input", updatePagesReadLimit);
updatePagesReadLimit();
const normalize = (value) => value.trim().toLowerCase();
const filterBooks = (books, term) => {
    const query = normalize(term);
    if (!query) {
        return books;
    }
    return books.filter((book) => {
        var _a, _b;
        const title = normalize(String((_a = book.title) !== null && _a !== void 0 ? _a : ""));
        const author = normalize(String((_b = book.author) !== null && _b !== void 0 ? _b : ""));
        return title.includes(query) || author.includes(query);
    });
};
if (searchInput) {
    searchInput.addEventListener("input", () => {
        renderBooks(filterBooks(allBooks, searchInput.value));
    });
}
function renderBooks(books) {
    const list = document.getElementById("bookList");
    const totalBooks = document.getElementById("totalBooks");
    const totalPages = document.getElementById("totalPages");
    const booksRead = books.filter(b => Number(b.finished) === 1).length;
    const pages = books.reduce((acc, b) => acc + Number(b.pagesRead || 0), 0);
    totalBooks.textContent = `${booksRead} / ${books.length} livres lus`;
    totalPages.textContent = `${pages} pages lues`;
    list.innerHTML = books.map((book, index) => {
        const percent = book.numberOfPages > 0
            ? Math.round((book.pagesRead / book.numberOfPages) * 100)
            : 0;
        const delay = Math.min(index * 60, 360);
        const isFinished = Number(book.finished) === 1;
        const statusOptions = STATUS_VALUES.map((status) => {
            const selected = book.status === status ? "selected" : "";
            return `<option ${selected}>${status}</option>`;
        }).join("");
        return `
      <article class="grid gap-3 rounded-2xl border border-[#dacdbd] bg-white p-5 shadow-[0_20px_45px_rgba(22,26,35,0.12)] animate-[rise_0.6s_ease_both]" style="animation-delay: ${delay}ms">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold" style="font-family: 'Playfair Display', serif;">${book.title}</h3>
            <p class="text-sm text-[#566070]">${book.author} · ${book.format}</p>
          </div>
          <span class="rounded-full border border-[#2f6f68]/40 bg-[#2f6f68]/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-[#2f6f68]">${book.status}</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-[#ece2d5]">
          <div class="h-full rounded-full bg-gradient-to-r from-[#b54d2e] to-[#d38b44]" style="width: ${percent}%"></div>
        </div>
        <p class="text-sm text-[#566070]">${book.pagesRead} / ${book.numberOfPages} pages — ${percent}%${isFinished ? "<span class='ml-2 font-semibold text-[#b54d2e]'>Termine</span>" : ""}</p>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <button onclick="toggleEdit('${book._id}', true)" class="text-xs uppercase tracking-[0.2em] text-[#2f6f68] hover:text-[#1f4b46]">Modifier</button>
          <button onclick="deleteBook('${book._id}')" class="text-xs uppercase tracking-[0.2em] text-[#b54d2e] hover:text-[#8f3b25]">Supprimer</button>
        </div>
        <div id="edit-${book._id}" class="hidden rounded-xl border border-[#dacdbd] bg-[#f6f1e7] p-3 text-sm">
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="grid gap-1 text-xs uppercase tracking-[0.2em] text-[#566070]">
              Pages lues
              <input id="pagesRead-${book._id}" type="number" min="0" max="${book.numberOfPages}" value="${book.pagesRead}" class="w-full rounded-lg border border-[#dacdbd] bg-white px-3 py-2 text-sm text-[#1d2230] focus:border-[#b54d2e] focus:outline-none focus:ring-2 focus:ring-[#b54d2e]/30" />
            </label>
            <label class="grid gap-1 text-xs uppercase tracking-[0.2em] text-[#566070]">
              Statut
              <select id="status-${book._id}" class="w-full rounded-lg border border-[#dacdbd] bg-white px-3 py-2 text-sm text-[#1d2230] focus:border-[#b54d2e] focus:outline-none focus:ring-2 focus:ring-[#b54d2e]/30">
                ${statusOptions}
              </select>
            </label>
          </div>
          <div class="mt-3 flex justify-end gap-2">
            <button onclick="saveEdit('${book._id}', ${book.numberOfPages})" class="rounded-full bg-[#1d2230] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white">Enregistrer</button>
            <button onclick="toggleEdit('${book._id}', false)" class="rounded-full border border-[#dacdbd] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#566070]">Annuler</button>
          </div>
        </div>
      </article>
    `;
    }).join("");
}
document.getElementById("bookForm").addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const get = (id) => document.getElementById(id).value;
    const numberOfPages = parseInt(get("numberOfPages"));
    let pagesRead = parseInt(get("pagesRead"));
    const priceRaw = get("price");
    const price = priceRaw ? parseFloat(priceRaw) : 0;
    if (!Number.isFinite(numberOfPages) || numberOfPages <= 0) {
        alert("Le nombre de pages doit etre >= 1.");
        return;
    }
    if (!Number.isFinite(pagesRead) || pagesRead < 0) {
        alert("Les pages lues doivent etre >= 0.");
        return;
    }
    if (pagesRead > numberOfPages) {
        alert("Les pages lues doivent etre <= au nombre de pages.");
        return;
    }
    let status = get("status");
    if (status === "Read") {
        pagesRead = numberOfPages;
    }
    if (pagesRead === numberOfPages) {
        status = "Read";
    }
    yield addBook({
        title: get("title"),
        author: get("author"),
        numberOfPages,
        status,
        price,
        pagesRead,
        format: get("format"),
        suggestedBy: get("suggestedBy")
    });
    e.target.reset();
}));
loadBooks();
export {};
//# sourceMappingURL=index.js.map