"use client";

import { Book, BookFunc, BookIdFunc, ModalMode, ViewMode, VoidFunc } from "@/types-interfaces/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { UpdateBookStatus, SetActiveTab } from '../../types-interfaces/types';

type BooksContextType = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  isBooksLoading: boolean;
  setIsBooksLoading: React.Dispatch<React.SetStateAction<boolean>>;
  editingBook: Book | null;
  setEditingBook: React.Dispatch<React.SetStateAction<Book | null>>;
  modalMode : ModalMode;
  setModalMode : React.Dispatch<React.SetStateAction<ModalMode>>;
  viewMode : ViewMode;
  setViewMode : React.Dispatch<React.SetStateAction<ViewMode>>
  isDetailsModalOpen : boolean;
  setIsDetailsModalOpen : React.Dispatch<React.SetStateAction<boolean>>
  isBookModalOpen: boolean;
  setIsBookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBook : Book | null
  setSelectedBook : React.Dispatch<React.SetStateAction<Book | null>>
  searchQuery : string;
  activeTab : string;
  setActiveTab : React.Dispatch<React.SetStateAction<string>>
  setSearchQuery : React.Dispatch<React.SetStateAction<string>>
  selectedGenre : string;
  setSelectedGenre : React.Dispatch<React.SetStateAction<string>>
  saveLibraryLoading : boolean;
  setSaveLibraryLoading : React.Dispatch<React.SetStateAction<boolean>>;
  addNewBook: (newBook: Omit<Book, "id">) => void;
  fetchBooks: () => Promise<void>;
  updateBookStatus: UpdateBookStatus;
  editBook: BookFunc;
  openEditModal : BookFunc;
  deleteBook : BookIdFunc;
  openDetailsModal : BookFunc;
  openAddModal : VoidFunc;
  closeModal : VoidFunc;
  closeDetailsModal: VoidFunc;
};

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isBooksLoading, setIsBooksLoading] = useState<boolean>(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [saveLibraryLoading, setSaveLibraryLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");



  const fetchBooks = async () => {
    setIsBooksLoading(true);
    try {
      const result = await fetch("/api/supabase/fetchBooks");

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const resJson = await result.json();
      const allBooks = resJson.data;

      if (!Array.isArray(allBooks)) {
        throw new Error("Invalid data format received");
      }

      // Optional: Remove this delay in production
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setBooks(allBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch books. Please try again.";

      toast("Error fetching books", {
        description: `${errorMessage}`,
        className:
          "bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-md border border-red-300/30 text-white shadow-2xl",
        descriptionClassName: "text-red-100",
        style: {
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(248, 113, 113, 0.3)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        },
      });
    } finally {
      setIsBooksLoading(false);
    }
  };

  const broadcastToOtherTabs = useCallback((eventType: string, data: any) => {
    if (typeof window !== "undefined") {
      const event = {
        type: eventType,
        data: data,
        timestamp: Date.now(),
        tabId: sessionStorage.getItem("tabId") || "unknown",
      };

      // Use a temporary localStorage key for event broadcasting
      const eventKey = `bookEvent_${Date.now()}_${Math.random()}`;
      localStorage.setItem(eventKey, JSON.stringify(event));

      // Clean up after a short delay
      setTimeout(() => {
        localStorage.removeItem(eventKey);
      }, 1000);
    }
  }, []);

  const addNewBook = useCallback(
    (newBook: Omit<Book, "id">) => {
      const isDuplicate = books.some(
        (existingBook) =>
          existingBook.title.toLowerCase().trim() ===
            newBook.title.toLowerCase().trim() &&
          existingBook.author.toLowerCase().trim() ===
            newBook.author.toLowerCase().trim()
      );

      if (isDuplicate) {
        toast("Book already exists!", {
          description: `"${newBook.title}" by ${newBook.author} is already in your library.`,
          className:
            "bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-md border border-yellow-300/30 text-white shadow-2xl",
          descriptionClassName: "text-yellow-100",
          style: {
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          },
        });
        return;
      }

      // If not duplicate, proceed with adding the book
      const bookWithId = {
        ...newBook,
        id: uuidv4(),
      };

      setBooks((prevBooks: Book[]) => {
        const updatedBooks = [...prevBooks, bookWithId];

        // Broadcast to other tabs - only send the new book, not all books
        broadcastToOtherTabs("ADD_BOOK", bookWithId);

        return updatedBooks;
      });

      toast("Book added successfully!", {
        description: `"${newBook.title}" has been added to your library.`,
        className:
          "bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md border border-green-300/30 text-white shadow-2xl",
        descriptionClassName: "text-green-100",
      });
    },
    [broadcastToOtherTabs, books]
  );

  const updateBookStatus: UpdateBookStatus = useCallback(
    (bookId: string, newStatus: Book["status"]) => {
      console.log('BOOK STATUS SET',newStatus)
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, status: newStatus } : book
        )
      );
    },
    []
  );

  const editBook = useCallback((updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    setIsBookModalOpen(false);
    setEditingBook(null);
  },[]);

  const openEditModal = useCallback((book: Book) => {
    setModalMode("edit");
    setEditingBook(book);
    setIsBookModalOpen(true);
    setIsDetailsModalOpen(false); // Close details modal if open
  },[]);

   const openDetailsModal = useCallback((book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  },[]);

  const deleteBook = useCallback((bookId: string) => {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    },[]);

  const openAddModal = useCallback(() => {
      setModalMode("add");
      setEditingBook(null);
      setIsBookModalOpen(true);
    },[]);

  const closeModal = useCallback(() => {
    setIsBookModalOpen(false);
    setEditingBook(null);
  },[]);

    const closeDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedBook(null);
  },[]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Generate a unique tab ID for this session
    if (typeof window !== "undefined" && !sessionStorage.getItem("tabId")) {
      sessionStorage.setItem("tabId", uuidv4());
    }

    const handleStorageChange = (e: StorageEvent) => {
      // Only listen to our book events
      if (e.key && e.key.startsWith("bookEvent_") && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          const currentTabId = sessionStorage.getItem("tabId");

          // Don't process events from the same tab
          if (event.tabId === currentTabId) {
            return;
          }
          
          switch (event.type) {
            case "ADD_BOOK":
              setBooks((prevBooks: Book[]) => {
                // Check if book already exists to avoid duplicates
                const bookExists = prevBooks.some(
                  (book) => book.id === event.data.id
                );
                if (!bookExists) {
                  return [...prevBooks, event.data];
                }
                return prevBooks;
              });
              break;

            case "UPDATE_BOOK":
              setBooks((prevBooks: Book[]) =>
                prevBooks.map((book) =>
                  book.id === event.data.id ? event.data : book
                )
              );
              break;

            case "DELETE_BOOK":
              setBooks((prevBooks: Book[]) =>
                prevBooks.filter((book) => book.id !== event.data.bookId)
              );
              break;

            case "REFRESH_BOOKS":
              // Trigger a refetch in this tab
              fetchBooks();
              break;
          }
        } catch (error) {
          console.error("Error parsing storage event:", error);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  return (
    <BooksContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedGenre,
        setSelectedGenre,
        searchQuery,
        setSearchQuery,
        books,
        setBooks,
        isBooksLoading,
        setIsBooksLoading,
        editingBook,
        setEditingBook,
        modalMode,
        setModalMode,
        viewMode,
        setViewMode,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        isBookModalOpen,
        setIsBookModalOpen,
        selectedBook,
        setSelectedBook,
        saveLibraryLoading,
        setSaveLibraryLoading,
        addNewBook,
        fetchBooks,
        updateBookStatus,
        editBook,
        openEditModal,
        openDetailsModal,
        deleteBook,
        openAddModal,
        closeModal,
        closeDetailsModal
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};
