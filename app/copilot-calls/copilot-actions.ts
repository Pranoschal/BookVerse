import { Book } from "@/lib/googleBooks";
import { useCopilotAction } from "@copilotkit/react-core";
import { useCopilotReadable } from "@copilotkit/react-core";
import { searchBooks } from "@/lib/googleBooks";

// Add this to your page.tsx component (inside the component function)
export function useBookCopilotActions<TAdd, TEdit extends { id: string }>(
  addNewBook: (book: TAdd) => void,
  editBook: (updatedBook: TEdit) => void,
  deleteBook: (bookId: string) => void,
  books: TEdit[]
) {
  useCopilotReadable(
    {
      description:
        "These are all the books that are there in the app.This is only for add,edit or delete operations and not to be used for searching a book.",
      value: books,
    },
    [books]
  );
  useCopilotAction({
    name: "searchBook",
    description:
      "Search for books using the Google Books API. Use this action when the user asks to find, search, or look up books by title only. Examples: 'search for Harry Potter'. IMPORTANT : No need to display the tool calls being made or functions called. Also dont call undefined functions unnecessarily.",
    parameters: [
      {
        name: "bookName",
        type: "string",
        description:
          "The book title, author name, or search keywords the user wants to search for",
        required: true,
      },
    ],
    handler: async ({ bookName }) => {
      try {
        const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: bookName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return `Error: ${errorData.error || 'Failed to search books'}`;
      }

        if (!response.ok) {
          const errorData = await response.json();
          return `Error: ${errorData.error || "Failed to search books"}`;
        }

        const books = await response.json();

        if (books.length === 0) {
          return "No books found for your search query.";
        }

        // Format the results with all Book properties except id and status
        const formattedResults = books
          .map(
            (book: any) =>
              `Title: ${book.title}
                Author: ${book.author}
                Cover: ${book.cover}
                Rating: ${book.rating}/5
                Genre: ${book.genre}
                Description: ${book.description}
                Pages: ${book.pages}
                Published: ${book.publishYear}
                Language: ${book.language}
            `
          )
          .join("\n");

        return `Found ${books.length} book(s):\n\n${formattedResults}`;
      } catch (error) {
        console.error("Error searching books:", error);
        return "Sorry, I couldn't search for books right now. Please try again later.";
      }
    },
  });
  useCopilotAction({
    name: "addBook",
    description:
      "IMPORTANT : Call this when the user wants to add a book.Add a new book to the user's BookVerse library with all necessary details. This action completes the book addition process entirely.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the book",
        required: true,
      },
      {
        name: "author",
        type: "string",
        description: "The author's name",
        required: true,
      },
      {
        name: "publisher",
        type: "string",
        description: "The publisher of the book",
        required: true,
      },
      {
        name: "genre",
        type: "string",
        description:
          "The genre of the book (e.g., Fiction, Non-Fiction, Mystery, Romance, Sci-Fi, Fantasy, etc.)",
        required: true,
      },
      {
        name: "language",
        type: "string",
        description: "The language the book is written in (default: English)",
        required: false,
      },
      {
        name: "rating",
        type: "number",
        description:
          "User's rating for the book (0-5 scale, can be decimal like 4.5)",
        required: false,
      },
      {
        name: "pages",
        type: "number",
        description: "Number of pages in the book",
        required: true,
      },
      {
        name: "publishYear",
        type: "number",
        description: "The year the book was published",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "A brief description or summary of the book",
        required: true,
      },
      {
        name: "cover",
        type: "string",
        description: "URL to the book's cover image",
        required: false,
      },
      {
        name: "status",
        type: "string",
        description:
          "Reading status: 'none', 'wishlist', 'readLater', or 'read'",
        required: false,
      },
    ],
    handler: async ({
      title,
      author,
      publisher,
      genre,
      language = "English",
      rating = 0,
      pages,
      publishYear,
      description,
      cover = "",
      status = "none",
    }) => {
      // Validate required fields
      if (
        !title ||
        !author ||
        !publisher ||
        !genre ||
        !description ||
        !pages ||
        !publishYear
      ) {
        throw new Error(
          "Missing required fields. Please provide title, author, publisher, genre, description, pages, and publish year."
        );
      }

      // Validate data types and ranges
      if (pages <= 0) {
        throw new Error("Number of pages must be greater than 0.");
      }

      if (publishYear < 1000 || publishYear > new Date().getFullYear() + 10) {
        throw new Error("Please provide a valid publish year.");
      }

      if (rating < 0 || rating > 5) {
        throw new Error("Rating must be between 0 and 5.");
      }

      // Validate status
      const validStatuses = ["none", "wishlist", "readLater", "read"];
      if (!validStatuses.includes(status)) {
        throw new Error(
          "Status must be one of: none, wishlist, readLater, or read."
        );
      }

      // Create the book object
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        genre,
        language,
        rating,
        pages,
        publishYear,
        description: description.trim(),
        cover: cover.trim() || "/placeholder.svg?height=300&width=200",
        status: status as "read" | "unread",
      };

      // Add the book
      addNewBook(newBook as TAdd);

      return `Successfully added "${title}" by ${author} to your BookVerse library!`;
    },
  });
  useCopilotAction({
    name: "editBook",
    description:
      "IMPORTANT: Call this when the user wants to edit or update an existing book. Edit an existing book in the user's BookVerse library by updating its details. This action completes the book editing process entirely.",
    parameters: [
      {
        name: "bookIdentifier",
        type: "string",
        description:
          "The title, author, or unique identifier to find the book to edit",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "The updated title of the book",
        required: false,
      },
      {
        name: "author",
        type: "string",
        description: "The updated author name",
        required: false,
      },
      {
        name: "publisher",
        type: "string",
        description: "The updated publisher name",
        required: false,
      },
      {
        name: "genre",
        type: "string",
        description:
          "The updated genre (e.g., Fiction, Non-Fiction, Mystery, Romance, Sci-Fi, Fantasy, etc.)",
        required: false,
      },
      {
        name: "language",
        type: "string",
        description:
          "The updated language of the book (e.g., English, Spanish, French, etc.)",
        required: false,
      },
      {
        name: "rating",
        type: "number",
        description: "The updated rating between 0 and 5",
        required: false,
      },
      {
        name: "pages",
        type: "number",
        description: "The updated number of pages",
        required: false,
      },
      {
        name: "publishYear",
        type: "number",
        description: "The updated publication year",
        required: false,
      },
      {
        name: "cover",
        type: "string",
        description: "The updated cover image URL of the book",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "The updated book description",
        required: false,
      },
      {
        name: "status",
        type: "string",
        description:
          "The updated reading status (none, wishlist, readLater, read)",
        required: false,
      },
    ],
    handler: async ({
      bookIdentifier,
      title,
      author,
      publisher,
      genre,
      language,
      rating,
      pages,
      publishYear,
      cover,
      description,
      status,
    }) => {
      // Find the existing book by title, author, or ID
      const existingBook = (books as any[]).find(
        (book) =>
          book.title?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
          book.author?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
          book.id === bookIdentifier
      );

      if (!existingBook) {
        throw new Error(
          `Book with identifier "${bookIdentifier}" not found in the library. Please check the book title or author name.`
        );
      }

      // Validate updated fields if provided
      if (pages !== undefined && pages <= 0) {
        throw new Error("Number of pages must be greater than 0.");
      }

      if (
        publishYear !== undefined &&
        (publishYear < 1000 || publishYear > new Date().getFullYear() + 10)
      ) {
        throw new Error("Please provide a valid publish year.");
      }

      if (rating !== undefined && (rating < 0 || rating > 5)) {
        throw new Error("Rating must be between 0 and 5.");
      }

      if (status !== undefined) {
        const validStatuses = ["none", "wishlist", "readLater", "read"];
        if (!validStatuses.includes(status)) {
          throw new Error(
            "Status must be one of: none, wishlist, readLater, or read."
          );
        }
      }

      // Create updated book object with only the fields that were provided
      const updatedBook = {
        ...existingBook,
        ...(title && { title: title.trim() }),
        ...(author && { author: author.trim() }),
        ...(publisher && { publisher: publisher.trim() }),
        ...(genre && { genre }),
        ...(language && { language }),
        ...(rating !== undefined && { rating }),
        ...(pages !== undefined && { pages }),
        ...(publishYear !== undefined && { publishYear }),
        ...(cover && { cover: cover.trim() }),
        ...(description && { description: description.trim() }),
        ...(status && {
          status: status as "none" | "wishlist" | "readLater" | "read",
        }),
      };

      // Update the book using your existing editBook function
      editBook(updatedBook as TEdit);

      return `Successfully updated "${updatedBook.title}" by ${updatedBook.author} in your BookVerse library!`;
    },
  });
  useCopilotAction({
    name: "deleteBook",
    description:
      "IMPORTANT: Call this when the user wants to delete or remove a book from their library. Delete an existing book from the user's BookVerse library. This action permanently removes the book from the collection.",
    parameters: [
      {
        name: "bookIdentifier",
        type: "string",
        description:
          "The title, author, or unique identifier to find the book to delete",
        required: true,
      },
    ],
    handler: async ({ bookIdentifier }) => {
      // Find the existing book by title, author, or ID
      const existingBook = (books as any[]).find(
        (book) =>
          book.title?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
          book.author?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
          book.id === bookIdentifier
      );

      if (!existingBook) {
        throw new Error(
          `Book with identifier "${bookIdentifier}" not found in the library. Please check the book title or author name.`
        );
      }

      // Delete the book using your existing deleteBook function
      deleteBook(existingBook.id);

      return `Successfully deleted "${existingBook.title}" by ${existingBook.author} from your BookVerse library!`;
    },
  });
}
