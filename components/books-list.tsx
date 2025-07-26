"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "./bookcard";
import { useBooks } from "@/app/contexts/booksContext";
import Library from "./library";
import { Badge } from "./ui/badge";
import { Book } from "@/types-interfaces/types";
import { ViewMode } from "../types-interfaces/types";

interface BooksListProps {
  currentPage: number;
  booksPerPage: number;
  filteredBooks: Book[];
}

export function BooksList({
  currentPage,
  booksPerPage,
  filteredBooks,
}: BooksListProps) {
  const { viewMode } = useBooks();
  const books = filteredBooks;
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return books.slice(startIndex, endIndex);
  }, [currentPage, booksPerPage,filteredBooks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="hidden md:flex flex-1"></div>
        <div className="text-left md:text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Your Book Library
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {books.length === 0 ? (
              "No books found"
            ) : (
              <>
                Showing {(currentPage - 1) * booksPerPage + 1}-
                {Math.min(currentPage * booksPerPage, books.length)} of{" "}
                {books.length} books
              </>
            )}
          </p>
        </div>
        <div className="hidden md:flex flex-1 justify-end mr-4">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
            Page {currentPage}
          </Badge>
        </div>
        <div className="md:hidden text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
            Page {currentPage}
          </Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {paginatedBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {paginatedBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No books found on this page.
          </p>
        </div>
      )}
    </div>
  );
}
