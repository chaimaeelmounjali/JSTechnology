export var Status;
(function (Status) {
    Status["Read"] = "Read";
    Status["Reread"] = "Re-read";
    Status["DNF"] = "DNF";
    Status["CurrentlyReading"] = "Currently reading";
    Status["ReturnedUnread"] = "Returned Unread";
    Status["WantToRead"] = "Want to read";
})(Status || (Status = {}));
export var Format;
(function (Format) {
    Format["Print"] = "Print";
    Format["PDF"] = "PDF";
    Format["Ebook"] = "Ebook";
    Format["AudioBook"] = "AudioBook";
})(Format || (Format = {}));
export class Book {
    constructor(title, author, numberOfPages, status, price, pagesRead, format, suggestedBy) {
        this.id = Date.now().toString();
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.status = status;
        this.price = price;
        this.pagesRead = pagesRead;
        this.format = format;
        this.suggestedBy = suggestedBy;
        this.finished = pagesRead === numberOfPages ? 1 : 0;
    }
    currentlyAt() {
        return Math.round((this.pagesRead / this.numberOfPages) * 100);
    }
    deleteBook(books) {
        return books.filter(b => b.id !== this.id);
    }
}
//# sourceMappingURL=Book.js.map