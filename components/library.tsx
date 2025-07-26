"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen, CheckCircle, Edit, Heart, Star, X } from "lucide-react";
import { Badge } from "./ui/badge";
import HamsterSpinner from "./hamster-spinner";
import { ViewMode,StatusCounts,Book, SetActiveTab } from "@/types-interfaces/types";
import { ActiveTab } from '../types-interfaces/types';
import PaginationComponent from "./pagination";
import { useBooks } from "@/app/contexts/booksContext";

interface LibraryProps {
  isLoading : boolean
  activeTab :ActiveTab,
  setActiveTab : SetActiveTab,
  viewMode: ViewMode;
  statusCounts: StatusCounts;
  filteredBooks: Book[];
}
const Library = ({
  isLoading,
  activeTab,
  setActiveTab,
  viewMode,
  statusCounts,
  filteredBooks,
}: LibraryProps) => {

  return (
    
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <TabsTrigger
            value="all"
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-1 sm:px-2 overflow-hidden"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden md:inline">All Books</span>
            <span className="md:hidden">All</span>
            <Badge
              variant="secondary"
              className="ml-0.5 sm:ml-1 bg-white/80 text-gray-700 text-xs px-1 py-0 flex-shrink-0"
            >
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-1 sm:px-2 overflow-hidden"
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden md:inline">Wishlist</span>
            <span className="md:hidden">Wish</span>
            <Badge
              variant="secondary"
              className="ml-0.5 sm:ml-1 bg-white/80 text-gray-700 text-xs px-1 py-0 flex-shrink-0"
            >
              {statusCounts.wishlist}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="readLater"
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-1 sm:px-2 overflow-hidden"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden md:inline">Read Later</span>
            <span className="md:hidden">Later</span>
            <Badge
              variant="secondary"
              className="ml-0.5 sm:ml-1 bg-white/80 text-gray-700 text-xs px-1 py-0 flex-shrink-0"
            >
              {statusCounts.readLater}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="read"
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 px-1 sm:px-2 overflow-hidden"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden md:inline">Completed</span>
            <span className="md:hidden">Done</span>
            <Badge
              variant="secondary"
              className="ml-0.5 sm:ml-1 bg-white/80 text-gray-700 text-xs px-1 py-0 flex-shrink-0"
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
            >
              {isLoading ? (
                <div className="col-span-full flex flex-col justify-center items-center space-y-4">
                  <HamsterSpinner
                    size="lg"
                    showText
                    loadingText="Fetching your library..."
                  />
                  <p className="text-sm text-gray-500">
                    This will complete in a few seconds...
                  </p>
                </div>
              ) : (
                <>
                  {filteredBooks ? 
                  (<PaginationComponent filteredBooks={filteredBooks}/>)
                :( <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-500">
                    Add books to your library or try adjusting your search or
                    filters.
                  </p>
                </motion.div>)}
                </>
              )}
            </motion.div>
          </AnimatePresence>


        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Library;
