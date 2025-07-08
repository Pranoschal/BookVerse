"use client";

import { CopilotPopup } from "@copilotkit/react-ui";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  BookOpen,
  CheckCircle,
  Star,
  Filter,
  Grid,
  List,
  X,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookModalComponent from "@/components/add-book-modal";
import BookDetailsModal from "@/components/book-details-modal";
import FloatingBooks from "@/components/floating-books";
import Image from "next/image";
import { useBookCopilotActions } from "./copilot-calls/copilot-actions";
import { v4 as uuidv4 } from "uuid";
import fetchAllBooks from "./supabase-actions";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  description: string;
  pages: number;
  publishYear: number;
  status: "none" | "wishlist" | "readLater" | "read";
  language: string;
  publisher: string;
}

const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    rating: 4.2,
    genre: "Fiction",
    description:
      "A magical library between life and death where every book represents a different life you could have lived. Nora Seed finds herself in this extraordinary place after feeling like her life has been a series of misfortunes and mistakes. In the Midnight Library, she gets to experience alternate versions of her life - what would have happened if she had made different choices? Each book in the library represents a different path she could have taken, from becoming a rock star to being a glaciologist in the Arctic. As Nora explores these different lives, she begins to understand what it truly means to live and discovers that even the most ordinary life can be extraordinary.",
    pages: 288,
    publishYear: 2020,
    status: "read",
    language: "English",
    publisher: "Canongate Books",
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    cover:
      "https://ia801708.us.archive.org/BookReader/BookReaderImages.php?zip=/31/items/atomic-habits/Atomic%20Habits%20-%20An%20Easy%20%26%20Proven%20Way%20To%20Build%20Good%20Habits%20%26%20Break%20Bad%20Ones_jp2.zip&file=Atomic%20Habits%20-%20An%20Easy%20%26%20Proven%20Way%20To%20Build%20Good%20Habits%20%26%20Break%20Bad%20Ones_jp2/Atomic%20Habits%20-%20An%20Easy%20%26%20Proven%20Way%20To%20Build%20Good%20Habits%20%26%20Break%20Bad%20Ones_0000.jp2&id=atomic-habits&scale=4&rotate=0",
    rating: 4.8,
    genre: "Self-Help",
    description:
      "An easy and proven way to build good habits and break bad ones. James Clear draws on the most proven ideas from biology, psychology, and neuroscience to create an easy-to-understand guide for making good habits inevitable and bad habits impossible. Along the way, readers will be inspired and entertained with true stories from Olympic gold medalists, award-winning artists, business leaders, life-saving physicians, and star comedians who have used the science of small habits to master their craft and vault to the top of their field.",
    pages: 320,
    publishYear: 2018,
    status: "wishlist",
    language: "English",
    publisher: "Avery",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScEtF9aLVNs4DvwTF0AzHn4mgqaT27YTBRgA&s",
    rating: 4.5,
    genre: "Sci-Fi",
    description:
      "A sweeping space opera set on the desert planet Arrakis. Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence—a commodity capable of unlocking humanity's greatest potential—only those who can conquer their fear will survive.",
    pages: 688,
    publishYear: 1965,
    status: "readLater",
    language: "English",
    publisher: "Chilton Books",
  },
  {
    id: "4",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover: "https://m.media-amazon.com/images/I/81LscKUplaL.jpg",
    rating: 4.6,
    genre: "Romance",
    description:
      "A reclusive Hollywood icon finally tells her story to a young journalist. Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now? Monique is not exactly on top of the world. Her husband has left her, and her career has stagnated. Regardless of why Evelyn has selected her to write her biography, Monique is determined to use this opportunity to jumpstart her career.",
    pages: 400,
    publishYear: 2017,
    status: "read",
    language: "English",
    publisher: "Atria Books",
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    cover: "https://m.media-amazon.com/images/I/41fkYRj1OwL._SL500_.jpg",
    rating: 4.4,
    genre: "Memoir",
    description:
      "A memoir about education, transformation, and the price of knowledge. Tara Westover was seventeen the first time she set foot in a classroom. Born to survivalists in the mountains of Idaho, she prepared for the end of the world by stockpiling home-canned peaches and sleeping with her 'head-for-the-hills bag'. In the summer she stewed herbs for her mother, a midwife and healer, and in the winter she salvaged in her father's junkyard. Her father forbade hospitals, so Tara never saw a doctor or nurse. Gashes and concussions, even burns from explosions, were all treated at home with herbalism.",
    pages: 334,
    publishYear: 2018,
    status: "none",
    language: "English",
    publisher: "Random House",
  },
  {
    id: "6",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover:
      "https://m.media-amazon.com/images/I/81JJPDNlxSL._UF1000,1000_QL80_.jpg",
    rating: 4.1,
    genre: "Thriller",
    description:
      "A psychological thriller about a woman who refuses to speak after allegedly murdering her husband. Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word. Alicia's refusal to talk, or give any kind of explanation, turns a domestic tragedy into something far grander, a mystery that captures the public imagination and casts Alicia into notoriety.",
    pages: 336,
    publishYear: 2019,
    status: "readLater",
    language: "English",
    publisher: "Celadon Books",
  },
];

export default async function BookWebsite() {

  useEffect(()=>{
    const fetchBooks = async()=>{
      const result = await fetch("/api/supabase/fetchBooks")
      const resJson = await result.json()
      const allBooks = resJson.data
      console.log(allBooks)
    }
    fetchBooks()
  })
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const genres = useMemo(() => {
    const allGenres = books.map((book) => book.genre);
    return ["all", ...Array.from(new Set(allGenres))];
  }, [books]);

  const filteredBooks = useMemo(() => {
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

  const updateBookStatus = (bookId: string, newStatus: Book["status"]) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      )
    );
  };

  const addNewBook = (newBook: Omit<Book, "id">) => {
    const bookWithId = {
      ...newBook,
      id: uuidv4(), // Simple ID generation
    };
    setBooks((prevBooks) => [...prevBooks, bookWithId]);
    setIsBookModalOpen(false);
  };

  const editBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const deleteBook = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setModalMode("edit");
    setEditingBook(book);
    setIsBookModalOpen(true);
    setIsDetailsModalOpen(false); // Close details modal if open
  };

  const openDetailsModal = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBook(null);
  };

  const getStatusCounts = () => {
    return {
      all: books.length,
      wishlist: books.filter((b) => b.status === "wishlist").length,
      readLater: books.filter((b) => b.status === "readLater").length,
      read: books.filter((b) => b.status === "read").length,
    };
  };

  const statusCounts = getStatusCounts();

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
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-2xl md:text-3xl lg:text-4xl block mb-2 text-blue-200">
                Welcome to
              </span>
              BookVerse
              <br />
              <span className="text-yellow-300">Your Reading Universe</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Curate your personal library, track your reading journey, and
              explore endless stories in your own BookVerse
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
              >
                Start Reading
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
              >
                Browse Collection
              </Button>
            </motion.div>
          </motion.div>
        </div>

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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 backdrop-blur-sm border border-white/20 shadow-lg">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">All Books</span>
                <span className="sm:hidden">All</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white/80 text-gray-700"
                >
                  {statusCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
                <span className="sm:hidden">Wish</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white/80 text-gray-700"
                >
                  {statusCounts.wishlist}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="readLater"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Read Later</span>
                <span className="sm:hidden">Later</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white/80 text-gray-700"
                >
                  {statusCounts.readLater}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white/80 text-gray-700"
                >
                  {statusCounts.read}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      {viewMode === "grid" ? (
                        <Card className="overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-blue-50/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col cursor-pointer">
                          <div className="relative overflow-hidden flex-shrink-0">
                            <img
                              src={book.cover || "/placeholder.svg"}
                              alt={book.title}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 bg-gray-200"
                              onClick={() => openDetailsModal(book)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-3 right-3 flex gap-2">
                              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
                                {book.genre}
                              </Badge>
                            </div>
                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(book);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg p-2 rounded-full"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBook(book.id);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg p-2 rounded-full"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={
                                    book.status === "wishlist"
                                      ? "default"
                                      : "secondary"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateBookStatus(
                                      book.id,
                                      book.status === "wishlist"
                                        ? "none"
                                        : "wishlist"
                                    );
                                  }}
                                  className={`flex-1 transition-all duration-300 ${
                                    book.status === "wishlist"
                                      ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg"
                                      : "bg-white/90 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white text-gray-800 border border-white/50"
                                  }`}
                                >
                                  <Heart
                                    className={`w-4 h-4 mr-1 ${
                                      book.status === "wishlist"
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                  Wish
                                </Button>
                                <Button
                                  size="sm"
                                  variant={
                                    book.status === "readLater"
                                      ? "default"
                                      : "secondary"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateBookStatus(
                                      book.id,
                                      book.status === "readLater"
                                        ? "none"
                                        : "readLater"
                                    );
                                  }}
                                  className={`flex-1 transition-all duration-300 ${
                                    book.status === "readLater"
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
                                      : "bg-white/90 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-gray-800 border border-white/50"
                                  }`}
                                >
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  Later
                                </Button>
                              </div>
                            </div>
                          </div>
                          <CardContent
                            className="p-4 flex-grow flex flex-col"
                            onClick={() => openDetailsModal(book)}
                          >
                            <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 mb-1">{book.author}</p>
                            <p className="text-gray-500 text-sm mb-2">
                              {book.publisher}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm font-medium">
                                  {book.rating}
                                </span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                {book.pages} pages
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                {book.language}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                              {book.description}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 mt-auto">
                            <Button
                              className={`w-full transition-all duration-300 ${
                                book.status === "read"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg"
                                  : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-500 hover:to-blue-500 hover:text-white text-gray-700 border border-gray-300"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateBookStatus(
                                  book.id,
                                  book.status === "read" ? "none" : "read"
                                );
                              }}
                            >
                              {book.status === "read" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Completed
                                </>
                              ) : (
                                "Mark as Read"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                          <CardContent
                            className="p-6"
                            onClick={() => openDetailsModal(book)}
                          >
                            <div className="flex gap-4 flex-col sm:flex-row">
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                className="w-20 h-28 object-cover rounded-lg shadow-md"
                                width={80} // Tailwind w-20 = 5rem = 80px
                                height={112} // Tailwind h-28 = 7rem = 112px
                                unoptimized // Optional: use this if the source is untrusted or not in remotePatterns
                              />

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                      {book.title}
                                    </h3>
                                    <p className="text-gray-600 mb-1">
                                      {book.author}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-2">
                                      {book.publisher}
                                    </p>
                                  </div>
                                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                                    {book.genre}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 font-medium">
                                      {book.rating}
                                    </span>
                                  </div>
                                  <span className="text-gray-600">
                                    {book.pages} pages
                                  </span>
                                  <span className="text-gray-600">
                                    {book.publishYear}
                                  </span>
                                  <span className="text-gray-600">
                                    {book.language}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {book.description}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant={
                                      book.status === "wishlist"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookStatus(
                                        book.id,
                                        book.status === "wishlist"
                                          ? "none"
                                          : "wishlist"
                                      );
                                    }}
                                    className={`transition-all duration-300 ${
                                      book.status === "wishlist"
                                        ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
                                        : "border-pink-300 text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white hover:border-transparent"
                                    }`}
                                  >
                                    <Heart
                                      className={`w-4 h-4 mr-1 ${
                                        book.status === "wishlist"
                                          ? "fill-current"
                                          : ""
                                      }`}
                                    />
                                    Wishlist
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      book.status === "readLater"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookStatus(
                                        book.id,
                                        book.status === "readLater"
                                          ? "none"
                                          : "readLater"
                                      );
                                    }}
                                    className={`transition-all duration-300 ${
                                      book.status === "readLater"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                                        : "border-emerald-300 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent"
                                    }`}
                                  >
                                    <BookOpen className="w-4 h-4 mr-1" />
                                    Read Later
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      book.status === "read"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBookStatus(
                                        book.id,
                                        book.status === "read" ? "none" : "read"
                                      );
                                    }}
                                    className={`transition-all duration-300 ${
                                      book.status === "read"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                                        : "border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent"
                                    }`}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {book.status === "read"
                                      ? "Completed"
                                      : "Mark as Read"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(book);
                                    }}
                                    className="border-blue-300 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBook(book.id);
                                    }}
                                    className="border-red-300 text-red-600 hover:bg-red-500 hover:text-white hover:border-transparent transition-all duration-300"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredBooks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
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
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900/50 to-blue-900/50 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-3xl font-bold mb-2 relative">
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]">
                  BookVerse
                </span>
              </h3>
              <p className="text-xl text-white font-medium">
                Your Reading Universe
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-100 mb-4 text-lg"
            >
              Discover, organize, and enjoy your literary journey
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base text-gray-200 font-medium"
            >
              Happy Reading! 📚 ✨
            </motion.div>
          </div>
        </div>
      </footer>
      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Hello, how can I help you today?",
        }}
      />
    </div>
  );
}
