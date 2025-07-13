
import { useCopilotAction } from "@copilotkit/react-core";
import { useCopilotReadable } from "@copilotkit/react-core";

// Add this to your page.tsx component (inside the component function)
export function useBookCopilotActions<
  TAdd,
  TEdit extends {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: string;
    rating: number;
  }
>(
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
      available: "enabled",
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
          "The book title the user wants to search for.",
        required: true,
      },
    ],
    handler: async ({ bookName }) => {
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: bookName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return `Error: ${errorData.error || "Failed to search books"}`;
        }

        if (!response.ok) {
          const errorData = await response.json();
          return `Error: ${errorData.error || "Failed to search books"}`;
        }

        const books = await response.json();
        console.log(books,'BOOKS')
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
      "IMPORTANT : Call this when the user wants to add a book. First search for the book using searchBook tool, then add a new book to the user's BookVerse library with all necessary details. This action completes the book addition process entirely. Don't show any unnecessary details and make function calls which are not even defined.",
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
        required: true,
      },
      {
        name: "rating",
        type: "number",
        description:
          "User's rating for the book (0-5 scale, can be decimal like 4.5)",
        required: true,
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
        required: true,
      },
      {
        name: "status",
        type: "string",
        description:
          "Reading status of the book, IMPORTANT : can be either 'none', 'wishlist', 'readLater', or 'read' , and nothing else apart from these four.",
        required: true,
      },
    ],
    handler: async ({
      title,
      author,
      publisher,
      genre,
      language,
      rating = 0,
      pages,
      publishYear,
      description,
      cover = "",
      status = "none",
    }) => {

      // First, search for the book using the search API
    let searchResults;
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: title }),
      });

      if (response.ok) {
        searchResults = await response.json();
      }
    } catch (error) {
      console.error("Error searching for book:", error);
    }

    // Use search results to populate missing fields
    let bookData = {
      title: title || "",
      author: author || "",
      publisher: publisher || "",
      genre: genre || "",
      language: language || "English",
      rating: rating || 0,
      pages: pages || 0,
      publishYear: publishYear || 0,
      description: description || "",
      cover: cover || "",
      status: status || "none",
    };

    // If we found search results, use the first match to populate missing fields
    if (searchResults && searchResults.length > 0) {
      const firstResult = searchResults[0];
      bookData = {
        title: title || firstResult.title || "",
        author: author || firstResult.author || "",
        publisher: publisher || firstResult.publisher || "",
        genre: genre || firstResult.genre || "",
        language: language || firstResult.language || "English",
        rating: rating || firstResult.rating || 0,
        pages: pages || firstResult.pages || 0,
        publishYear: publishYear || firstResult.publishYear || 0,
        description: description || firstResult.description || "",
        cover: cover || firstResult.cover || "/placeholder.svg?height=300&width=200",
        status: status || "none",
      };
    }
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

      // Check for existing books with same title, author, and publish year
      const existingBooks = (books as any[]).filter(
        (book) =>
          book.title?.toLowerCase().trim() === title.toLowerCase().trim() ||
          book.author?.toLowerCase().trim() === author.toLowerCase().trim()
      );

      if (existingBooks.length > 0) {
        const duplicatesList = existingBooks
          .map(
            (book) =>
              `ID: ${book.id} - "${book.title}" by ${book.author} (${book.publishYear})`
          )
          .join("\n");

        return `This book already exists in your library!

Existing book(s):
${duplicatesList}

The book was not added to avoid duplicates. If you want to update the existing book, use the edit function with the book ID.`;
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
        status: status as "none" | "wishlist" | "readLater" | "read",
      };

      console.log(newBook)
      // Add the book
      addNewBook(newBook as TAdd);

      return `Successfully added "${title}" by ${author} to your BookVerse library!`;
    },
  });

  // useCopilotAction({
  //   name: "editBook",
  //   description:
  //     "IMPORTANT: Call this when the user wants to edit or update an existing book. Edit an existing book in the user's BookVerse library by updating its details. This action completes the book editing process entirely.",
  //   parameters: [
  //     {
  //       name: "bookIdentifier",
  //       type: "string",
  //       description:
  //         "The title, author, or unique identifier to find the book to edit",
  //       required: true,
  //     },
  //     {
  //       name: "title",
  //       type: "string",
  //       description: "The updated title of the book",
  //       required: false,
  //     },
  //     {
  //       name: "author",
  //       type: "string",
  //       description: "The updated author name",
  //       required: false,
  //     },
  //     {
  //       name: "publisher",
  //       type: "string",
  //       description: "The updated publisher name",
  //       required: false,
  //     },
  //     {
  //       name: "genre",
  //       type: "string",
  //       description:
  //         "The updated genre (e.g., Fiction, Non-Fiction, Mystery, Romance, Sci-Fi, Fantasy, etc.)",
  //       required: false,
  //     },
  //     {
  //       name: "language",
  //       type: "string",
  //       description:
  //         "The updated language of the book (e.g., English, Spanish, French, etc.)",
  //       required: false,
  //     },
  //     {
  //       name: "rating",
  //       type: "number",
  //       description: "The updated rating between 0 and 5",
  //       required: false,
  //     },
  //     {
  //       name: "pages",
  //       type: "number",
  //       description: "The updated number of pages",
  //       required: false,
  //     },
  //     {
  //       name: "publishYear",
  //       type: "number",
  //       description: "The updated publication year",
  //       required: false,
  //     },
  //     {
  //       name: "cover",
  //       type: "string",
  //       description: "The updated cover image URL of the book",
  //       required: false,
  //     },
  //     {
  //       name: "description",
  //       type: "string",
  //       description: "The updated book description",
  //       required: false,
  //     },
  //     {
  //       name: "status",
  //       type: "string",
  //       description:
  //         "The updated reading status (none, wishlist, readLater, read)",
  //       required: false,
  //     },
  //   ],
  //   handler: async ({
  //     bookIdentifier,
  //     title,
  //     author,
  //     publisher,
  //     genre,
  //     language,
  //     rating,
  //     pages,
  //     publishYear,
  //     cover,
  //     description,
  //     status,
  //   }) => {
  //     // Find the existing book by title, author, or ID
  //     const existingBook = (books as any[]).find(
  //       (book) =>
  //         book.title?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
  //         book.author?.toLowerCase().includes(bookIdentifier.toLowerCase()) ||
  //         book.id === bookIdentifier
  //     );

  //     if (!existingBook) {
  //       throw new Error(
  //         `Book with identifier "${bookIdentifier}" not found in the library. Please check the book title or author name.`
  //       );
  //     }

  //     // Validate updated fields if provided
  //     if (pages !== undefined && pages <= 0) {
  //       throw new Error("Number of pages must be greater than 0.");
  //     }

  //     if (
  //       publishYear !== undefined &&
  //       (publishYear < 1000 || publishYear > new Date().getFullYear() + 10)
  //     ) {
  //       throw new Error("Please provide a valid publish year.");
  //     }

  //     if (rating !== undefined && (rating < 0 || rating > 5)) {
  //       throw new Error("Rating must be between 0 and 5.");
  //     }

  //     if (status !== undefined) {
  //       const validStatuses = ["none", "wishlist", "readLater", "read"];
  //       if (!validStatuses.includes(status)) {
  //         throw new Error(
  //           "Status must be one of: none, wishlist, readLater, or read."
  //         );
  //       }
  //     }

  //     // Create updated book object with only the fields that were provided
  //     const updatedBook = {
  //       ...existingBook,
  //       ...(title && { title: title.trim() }),
  //       ...(author && { author: author.trim() }),
  //       ...(publisher && { publisher: publisher.trim() }),
  //       ...(genre && { genre }),
  //       ...(language && { language }),
  //       ...(rating !== undefined && { rating }),
  //       ...(pages !== undefined && { pages }),
  //       ...(publishYear !== undefined && { publishYear }),
  //       ...(cover && { cover: cover.trim() }),
  //       ...(description && { description: description.trim() }),
  //       ...(status && {
  //         status: status as "none" | "wishlist" | "readLater" | "read",
  //       }),
  //     };

  //     // Update the book using your existing editBook function
  //     editBook(updatedBook as TEdit);

  //     return `Successfully updated "${updatedBook.title}" by ${updatedBook.author} in your BookVerse library!`;
  //   },
  // });

  useCopilotAction({
    name: "findBookId",
    description:
      "Find the book ID for a book by searching through the user's library. Use this when the user wants to edit or delete a book but you need to find its ID first.",
    parameters: [
      {
        name: "searchTerm",
        type: "string",
        description:
          "The book title, author name, or keywords to search for in the user's library",
        required: true,
      },
    ],
    handler: async ({ searchTerm }) => {
      const matchingBooks = (books as any[]).filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingBooks.length === 0) {
        return `No books found matching "${searchTerm}" in your library.`;
      }

      if (matchingBooks.length === 1) {
        const book = matchingBooks[0];
        return `Found book: "${book.title}" by ${book.author}
Book ID: ${book.id}

Current details:
- Title: ${book.title}
- Author: ${book.author}
- Publisher: ${book.publisher || "Not specified"}
- Genre: ${book.genre || "Not specified"}
- Language: ${book.language || "Not specified"}
- Rating: ${book.rating || 0}/5
- Pages: ${book.pages || "Not specified"}
- Published: ${book.publishYear || "Not specified"}
- Status: ${book.status || "none"}

You can now edit or delete  this book depending on what action the user wants to do using the book ID: ${
          book.id
        }`;
      }

      // Multiple matches found
      const bookList = matchingBooks
        .map((book) => `ID: ${book.id} - "${book.title}" by ${book.author}`)
        .join("\n");

      return `Found ${matchingBooks.length} books matching "${searchTerm}":

${bookList}

Please specify which book you want to edit or delete by using its exact ID.`;
    },
  });
  useCopilotAction({
    name: "editBook",
    description:
      "IMPORTANT: Call this when the user wants to edit or update an existing book. This action requires the exact book ID. To find the book ID, first look at the available books list to identify the correct book ID for the book the user wants to edit.",
    parameters: [
      {
        name: "bookId",
        type: "string",
        description:
          "The exact book ID from the available books list. This must be the exact ID, not the title or author name.",
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
      bookId,
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
      // Find the existing book by ID only
      const existingBook = (books as any[]).find((book) => book.id === bookId);

      if (!existingBook) {
        // Provide helpful error message with available book IDs
        const availableBooks = (books as any[])
          .map((book) => `ID: ${book.id} - "${book.title}" by ${book.author}`)
          .join("\n");

        return `Book with ID "${bookId}" not found in the library. 

Available books:
${availableBooks}

Please use the exact book ID from the list above.`;
      }

      // Validate updated fields if provided
      if (pages !== undefined && pages <= 0) {
        return "Error: Number of pages must be greater than 0.";
      }

      if (
        publishYear !== undefined &&
        (publishYear < 1000 || publishYear > new Date().getFullYear() + 10)
      ) {
        return "Error: Please provide a valid publish year.";
      }

      if (rating !== undefined && (rating < 0 || rating > 5)) {
        return "Error: Rating must be between 0 and 5.";
      }

      if (status !== undefined) {
        const validStatuses = ["none", "wishlist", "readLater", "read"];
        if (!validStatuses.includes(status)) {
          return "Error: Status must be one of: none, wishlist, readLater, or read.";
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
      "IMPORTANT: Call this when the user wants to delete or remove a book from their library. This action requires the exact book ID. To find the book ID, first look at the available books list to identify the correct book ID for the book the user wants to delete.",
    parameters: [
      {
        name: "bookId",
        type: "string",
        description:
          "The exact book ID from the available books list. This must be the exact ID, not the title or author name.",
        required: true,
      },
    ],
    handler: async ({ bookId }) => {
      // Find the existing book by ID only
      const existingBook = (books as any[]).find((book) => book.id === bookId);

      if (!existingBook) {
        // Provide helpful error message with available book IDs
        const availableBooks = (books as any[])
          .map((book) => `ID: ${book.id} - "${book.title}" by ${book.author}`)
          .join("\n");

        return `Book with ID "${bookId}" not found in the library. 

Available books:
${availableBooks}

Please use the exact book ID from the list above.`;
      }

      // Delete the book using the existing deleteBook function
      deleteBook(bookId);

      return `Successfully deleted "${existingBook.title}" by ${existingBook.author} from your BookVerse library!`;
    },
  });
  //   useCopilotAction({
  //     name: "findBookId",
  //     description:
  //       "Find the book ID for a book by searching through the user's library. Use this when the user wants to delete a book but you need to find its ID first.",
  //     parameters: [
  //       {
  //         name: "searchTerm",
  //         type: "string",
  //         description:
  //           "The book title, author name, or keywords to search for in the user's library",
  //         required: true,
  //       },
  //     ],
  //     handler: async ({ searchTerm }) => {
  //       const matchingBooks = (books as any[]).filter(
  //         (book) =>
  //           book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  //       );

  //       if (matchingBooks.length === 0) {
  //         return `No books found matching "${searchTerm}" in your library.`;
  //       }

  //       if (matchingBooks.length === 1) {
  //         const book = matchingBooks[0];
  //         return `Found book: "${book.title}" by ${book.author}
  // Book ID: ${book.id}

  // You can now delete this book using the book ID: ${book.id}`;
  //       }

  //       // Multiple matches found
  //       const bookList = matchingBooks
  //         .map((book) => `ID: ${book.id} - "${book.title}" by ${book.author}`)
  //         .join("\n");

  //       return `Found ${matchingBooks.length} books matching "${searchTerm}":

  // ${bookList}

  // Please specify which book you want to delete by using its exact ID.`;
  //     },
  //   });
}
