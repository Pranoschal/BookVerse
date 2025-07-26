import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  BookOpen,
  CheckCircle,
  Edit,
  Heart,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { Book, BookFunc, BookIdFunc, UpdateBookStatus, ViewMode } from "@/types-interfaces/types";
import { useBooks } from "@/app/contexts/booksContext";

interface BookCardProps {
  book: Book;
  index: number;
}
export default function BookCard({ book, index}: BookCardProps) {
   const {
      updateBookStatus, 
      viewMode,
      deleteBook,
      openEditModal,
      openDetailsModal 
    } = useBooks();

    console.log('RERENDERED',book.title,book.status)
  return (
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
                  variant={book.status === "wishlist" ? "default" : "secondary"}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBookStatus(
                      book.id,
                      book.status === "wishlist" ? "none" : "wishlist"
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
                      book.status === "wishlist" ? "fill-current" : ""
                    }`}
                  />
                  Wish
                </Button>
                <Button
                  size="sm"
                  variant={
                    book.status === "readLater" ? "default" : "secondary"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBookStatus(
                      book.id,
                      book.status === "readLater" ? "none" : "readLater"
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
            <p className="text-gray-500 text-sm mb-2">{book.publisher}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{book.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{book.pages} pages</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{book.language}</span>
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
          <CardContent className="p-6" onClick={() => openDetailsModal(book)}>
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
                    <p className="text-gray-600 mb-1">{book.author}</p>
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
                    <span className="ml-1 font-medium">{book.rating}</span>
                  </div>
                  <span className="text-gray-600">{book.pages} pages</span>
                  <span className="text-gray-600">{book.publishYear}</span>
                  <span className="text-gray-600">{book.language}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={book.status === "wishlist" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateBookStatus(
                        book.id,
                        book.status === "wishlist" ? "none" : "wishlist"
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
                        book.status === "wishlist" ? "fill-current" : ""
                      }`}
                    />
                    Wishlist
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      book.status === "readLater" ? "default" : "outline"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      updateBookStatus(
                        book.id,
                        book.status === "readLater" ? "none" : "readLater"
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
                    variant={book.status === "read" ? "default" : "outline"}
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
                    {book.status === "read" ? "Completed" : "Mark as Read"}
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
  );
};
