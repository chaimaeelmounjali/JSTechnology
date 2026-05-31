export enum Status {
  Read = "Read",
  Reread = "Re-read",
  DNF = "DNF",
  CurrentlyReading = "Currently reading",
  ReturnedUnread = "Returned Unread",
  WantToRead = "Want to read"
}

export enum Format {
  Print = "Print",
  PDF = "PDF",
  Ebook = "Ebook",
  AudioBook = "AudioBook"
}

export class Book {
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

  constructor(
    title: string,
    author: string,
    numberOfPages: number,
    status: Status,
    price: number,
    pagesRead: number,
    format: Format,
    suggestedBy: string
  ) {
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

  currentlyAt(): number {
    return Math.round((this.pagesRead / this.numberOfPages) * 100);
  }

  deleteBook(books: Book[]): Book[] {
    return books.filter(b => b.id !== this.id);
  }
}