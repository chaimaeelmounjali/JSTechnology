export declare enum Status {
    Read = "Read",
    Reread = "Re-read",
    DNF = "DNF",
    CurrentlyReading = "Currently reading",
    ReturnedUnread = "Returned Unread",
    WantToRead = "Want to read"
}
export declare enum Format {
    Print = "Print",
    PDF = "PDF",
    Ebook = "Ebook",
    AudioBook = "AudioBook"
}
export declare class Book {
    id: string;
    title: string;
    author: string;
    numberOfPages: number;
    status: Status;
    price: number;
    pagesRead: number;
    format: Format;
    suggestedBy: string;
    finished: number;
    constructor(title: string, author: string, numberOfPages: number, status: Status, price: number, pagesRead: number, format: Format, suggestedBy: string);
    currentlyAt(): number;
    deleteBook(books: Book[]): Book[];
}
//# sourceMappingURL=Book.d.ts.map