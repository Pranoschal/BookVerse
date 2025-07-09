"use client";

import { CopilotPopup } from "@copilotkit/react-ui";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BookModalComponent from "@/components/add-book-modal";
import BookDetailsModal from "@/components/book-details-modal";
import FloatingBooks from "@/components/floating-books";
import { useBookCopilotActions } from "./copilot-calls/copilot-actions";
import { v4 as uuidv4 } from "uuid";
import FooterSection from "@/components/footer";
import Banner from "@/components/banner";
import Library from "@/components/library";
import {
  ViewMode,
  StatusCounts,
  Book,
  VoidFunc,
  BookFunc,
  BookIdFunc,
  UpdateBookStatus,
  AddNewBook,
  ModalMode
} from "@/types-interfaces/types";
import { AssistantMessage } from "@/components/copilotkitpopup/assistant-message";
import { UserMessage } from "@/components/copilotkitpopup/user-message";
import { ChatHeader } from "@/components/copilotkitpopup/header";
import { ChatButton } from "@/components/copilotkitpopup/chat-button";

export default function BookWebsite() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const result = await fetch("/api/supabase/fetchBooks");

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const resJson = await result.json();
      const allBooks = resJson.data;

      // Add 5-second timeout to see loading icon
      await new Promise(resolve => setTimeout(resolve, 5000));

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
      setIsLoading(false);
    }
  };

  fetchBooks();
}, []);

  const genres : string[] = useMemo(() => {
    const allGenres = books.map((book) => book.genre);
    return ["all", ...Array.from(new Set(allGenres))];
  }, [books]);

  const filteredBooks :Book[] = useMemo(() => {
    let filtered = books;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((book) => {
        switch (activeTab) {
          case "wishlist":
            return book.status === "wishlist";
          case "readLater":
            return book.status === "readLater";
          case "read":
            return book.status === "read";
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [books, searchQuery, selectedGenre, activeTab]);

  const updateBookStatus: UpdateBookStatus = (
    bookId: string,
    newStatus: Book["status"]
  ) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      )
    );
  };

  const addNewBook : AddNewBook = (newBook: Omit<Book, "id">) => {
    const bookWithId = {
      ...newBook,
      id: uuidv4(), // Simple ID generation
    };
    setBooks((prevBooks) => [...prevBooks, bookWithId]);
    setIsBookModalOpen(false);
  };

  const editBook :BookFunc = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const deleteBook: BookIdFunc = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const openAddModal : VoidFunc = () => {
    setModalMode("add");
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const openEditModal: BookFunc = (book: Book) => {
    setModalMode("edit");
    setEditingBook(book);
    setIsBookModalOpen(true);
    setIsDetailsModalOpen(false); // Close details modal if open
  };

  const openDetailsModal: BookFunc = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  };

  const closeModal : VoidFunc = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const closeDetailsModal : VoidFunc= () => {
    setIsDetailsModalOpen(false);
    setSelectedBook(null);
  };

  const getStatusCounts  = ():StatusCounts => {
    return {
      all: books.length,
      wishlist: books.filter((b) => b.status === "wishlist").length,
      readLater: books.filter((b) => b.status === "readLater").length,
      read: books.filter((b) => b.status === "read").length,
    };
  };

  const statusCounts: StatusCounts = getStatusCounts();

  useBookCopilotActions<Omit<Book, "id">, Book>(
    addNewBook,
    editBook,
    deleteBook,
    books
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white"
      >
        <div className="absolute inset-0 bg-black/20" />
        <Banner />

        {/* Floating Books Animation */}
        <FloatingBooks />
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40 bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-sm border border-purple-200 focus:border-purple-400">
                  <Filter className="w-4 h-4 mr-2 text-purple-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm border border-purple-200">
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre}
                      value={genre}
                      className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
                    >
                      {genre === "all" ? "All Genres" : genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-sm rounded-lg p-1 border border-purple-200">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : "hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`px-3 transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : "hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={openAddModal}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg px-6 py-2 font-semibold transition-all duration-300 hover:scale-105"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Library
          isLoading = {isLoading}
          activeTab={activeTab}
          setActiveTab = {setActiveTab}
          viewMode={viewMode}
          statusCounts={statusCounts}
          filteredBooks={filteredBooks}
          openDetailsModal={openDetailsModal}
          openEditModal={openEditModal}
          deleteBook={deleteBook}
          updateBookStatus={updateBookStatus}
        />
      </div>

      {/* Book Modal */}
      <BookModalComponent
        isOpen={isBookModalOpen}
        onClose={closeModal}
        onAddBook={addNewBook}
        onEditBook={editBook}
        editingBook={editingBook}
        mode={modalMode}
      />

      {/* Book Details Modal */}
      <BookDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        book={selectedBook}
        onUpdateStatus={updateBookStatus}
        onEdit={openEditModal}
        onDelete={deleteBook}
      />

      {/* Footer */}
      <FooterSection />
      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Hello, how can I help you today?",
        }}
      UserMessage={UserMessage}
      AssistantMessage={AssistantMessage}
      Header={ChatHeader}
      // Button={() => <ChatButton onClick={handleOpenPopup} />} 
      />
    </div>
  );
}
