"use client";

import { AddNewBook, Book, VoidFunc } from "@/types-interfaces/types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";
import { useBooks } from "../contexts/booksContext";
import {
  useCopilotAction,
  useCopilotReadable,
  useCopilotChat,
} from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import Footer from "@/components/footer";
import RecommendedBookDetailsModal from "@/components/recomm-book-details";

export default function BookRecommendationPage() {
  const { addNewBook } = useBooks();
  const [genre, setGenre] = useState("Fiction");
  const [interests, setInterests] = useState("Reading");
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);


  // Modify your useCopilotChat hook to include the key
  const { appendMessage, stopGeneration, visibleMessages, setMessages, reset } =
    useCopilotChat();
  const [isLoading, setIsLoading] = useState(false);

  const clearChat = async () => {
    await reset();
  };

  const closeDetailsModal: VoidFunc = () => {
    setIsDetailsModalOpen(false);
    setSelectedBook(null);
  };

  useCopilotReadable({
    description: "User's current book preferences and page state",
    value: {
      genre,
      interests,
      hasRecommendations: showRecommendations,
      currentRecommendations: recommendations,
      instructions:
        "IMPORTANT: When the user asks for book recommendations, you MUST call the displayBookRecommendations function with an array of book titles. Always use this function instead of providing text responses.",
    },
  });

  useCopilotAction({
    name: "bookRecommendations",
    description:
      "This tool takes in the titles only of the suggested books and carries out further actions.",
    parameters: [
      {
        name: "bookTitles",
        type: "object[]",
        description: "Array of book recommendations with titles only.",
        attributes: [
          {
            name: "title",
            type: "string",
            description: "The title of the book",
            required: true,
          },
        ],
      },
    ],
    handler: async ({ bookTitles }) => {
      const bookTitleRecommendations: string[] = bookTitles.map(
        (item) => item.title || "Unknown Title"
      );

      try {
        const bookPromises = bookTitleRecommendations.map(async (title) => {
          try {
            const response = await fetch("/api/search", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ query: title }),
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch details for ${title}`);
            }
            const bookDataArray = await response.json();
            let bookData = bookDataArray.find(
              (book: Book) =>
                book.cover && !book.cover.includes("/placeholder.svg")
            );

            // If no book without placeholder is found, fall back to the first book
            if (!bookData) {
              bookData = bookDataArray[0];
            }
            if (!bookData) {
              throw new Error(`No book found for ${title}`);
            }
            console.log(bookData, "Book Data");

            return {
              ...bookData,
              status: bookData.status === "unread" ? "none" : bookData.status,
            };
          } catch (error) {
            console.error(`Error fetching book details for ${title}:`, error);
            // Return a fallback book object if API call fails
            return {
              id: Math.random().toString(36).substr(2, 9),
              title: title,
              author: "Unknown Author",
              cover: "/placeholder.svg?height=300&width=200",
              rating: 0,
              genre: "Unknown Genre",
              description: "No description available.",
              pages: 0,
              publisher: "Unknown Publisher",
              publishYear: 0,
              status: "none" as const,
              language: "Unknown",
            };
          }
        });

        const bookRecommendations = await Promise.all(bookPromises);

        setRecommendations(bookRecommendations);
        setShowRecommendations(true);
        return {
          success: true,
          message: `Successfully displayed ${bookRecommendations.length} book recommendations on the page`,
        };
      } catch (error) {
        console.error("Error processing book recommendations:", error);
        return {
          success: false,
          message: "Failed to process book recommendations",
        };
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    console.log(visibleMessages, "MESSAGES");
  }, [visibleMessages]);

  const handleGetRecommendations = async () => {
    setRecommendations([]);
    setShowRecommendations(false);
    setIsLoading(true);

    await clearChat();

    // const message = `I want book recommendations for the genre "${genre}" and interests "${interests}".
    // Please recommend 4-6 books and CALL THE displayBookRecommendations FUNCTION to show them on the page.
    // You must use the displayBookRecommendations function - do not just list books in text.
    // For each book, provide just the title in the recommendations array.`;

    const message = `Based on what you know,can you please suggest me 4-6 books which I can read with the genre :"${genre}" and based on my interests : "${interests}".`;

    appendMessage(
      new TextMessage({
        content: message,
        role: Role.User,
      })
    );
  };

  const handleAddBookToCollection = (book: Omit<Book, "id">) => {
    addNewBook(book);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const bookCardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-6 md:mb-8"
          >
            <div className="flex flex-wrap items-start justify-center mb-4">
              {/* Icon + Book */}
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-yellow-300" />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Book
                </h1>
              </div>

              {/* Recommendations */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white w-full text-center sm:text-left mt-1 sm:mt-0 sm:w-auto sm:ml-2">
                Recommendations
              </h1>
            </div>

            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
              Discover your next favorite read with AI-powered personalized
              recommendations
            </p>
          </motion.div>

          {/* Form Section */}
          <motion.div variants={itemVariants} className="mb-8 md:mb-10">
<Card className="shadow-2xl border-0 bg-gradient-to-r from-purple-400/70 via-pink-400/65 to-indigo-500/70 bg-[length:200%_200%] animate-gradient">  <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="genre"
                      className="text-base md:text-lg font-semibold text-purple-800"
                    >
                      What would you like to get a book recommendation on?
                    </Label>
                    <Input
                      id="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="e.g., Fiction, Mystery, Science Fiction..."
                      className="text-base md:text-lg py-3 px-4 bg-purple-200/40 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="interests"
                      className="text-base md:text-lg font-semibold text-purple-800"
                    >
                      Your interests and hobbies
                    </Label>
                    <Input
                      id="interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g., Reading, History, Technology..."
                      className="text-base md:text-lg py-3 px-4 bg-purple-200/40 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleGetRecommendations}
                      disabled={isLoading}
                      className="w-full py-4 text-base md:text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border-0"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Getting AI Recommendations...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Get AI Recommendations
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations Section */}
          {showRecommendations && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  AI-Powered Recommendations
                </h2>
                <p className="text-blue-100 text-lg">
                  Based on your preferences for {genre.toLowerCase()} and{" "}
                  {interests.toLowerCase()}, I would suggest the following
                  books...
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recommendations.map((book, index) => (
                  <motion.div
                    key={book.id}
                    variants={bookCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card onClick={()=>{setIsDetailsModalOpen(true), setSelectedBook(book)}} className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500/50 to-blue-500/50 backdrop-blur-sm h-full flex flex-col">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="relative flex-1">
                          {/* Genre Badge */}
                          <div className="absolute top-0 left-0 z-10">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200">
                              {book.genre}
                            </span>
                          </div>

                          {/* Add to List Button */}
                          <motion.button
                            onClick={() => {
                              const { id, ...bookWithoutId } = book;
                              handleAddBookToCollection(bookWithoutId);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-0 right-0 z-10 w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>

                          {/* Book Cover */}
                          <div className="relative mb-3 mx-auto w-24 h-36 mt-8">
                            <Image
                              src={book.cover || "/placeholder.svg"}
                              alt={`Cover of ${book.title}`}
                              fill
                              className="object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                            />
                          </div>

                          {/* Book Info */}
                          <div className="text-center space-y-2 flex-1">
                            <h3 className="font-bold text-base text-purple-800 line-clamp-2 min-h-[2.5rem]">
                              {book.title}
                            </h3>
                            <p className="text-purple-600 font-medium text-sm">
                              {book.author}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center justify-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(book.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-purple-500 ml-1">
                                {book.rating}
                              </span>
                            </div>

                            <p className="text-xs text-purple-500 line-clamp-2 min-h-[2rem]">
                              {book.description}
                            </p>

                            {/* Book Details */}
                            <div className="text-xs text-purple-400 space-y-1 pt-2">
                              <div>
                                {book.pages} pages • {book.publishYear}
                              </div>
                              <div>{book.publisher}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <RecommendedBookDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                book={selectedBook}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
