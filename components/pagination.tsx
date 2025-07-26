"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BooksList } from "./books-list"
import { Book } from "@/types-interfaces/types"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

interface MainPaginationProps {
  filteredBooks : Book[]
}

export default function PaginationComponent({filteredBooks}:MainPaginationProps) {
  const books = filteredBooks
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 8
  const totalBooks = books.length
  const totalPages = Math.ceil(totalBooks / booksPerPage)

  // Reset current page when filtered books change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredBooks])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="h-full bg-transparent">
      <BooksList currentPage={currentPage} booksPerPage={booksPerPage} filteredBooks={filteredBooks}/>

      {totalPages > 0 && (
        <div className="flex justify-center pt-8">
          <CoolPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

function CoolPagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getVisiblePages = () => {
    if (totalPages === 0) return []
    if (totalPages === 1) return [1]
    
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Add first page
    rangeWithDots.push(1)

    // Add ellipsis if there's a gap between 1 and the range around current page
    if (currentPage - delta > 2) {
      rangeWithDots.push("...")
    }

    // Add range around current page (excluding first and last page)
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }
    
    rangeWithDots.push(...range)

    // Add ellipsis if there's a gap between the range and last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...")
    }

    // Add last page (only if it's different from first page)
    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className={cn("flex justify-center", className)} aria-label="Pagination">
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Previous Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              "h-9 w-9 sm:h-10 sm:w-10 p-0 border-2 transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-950",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-background",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </motion.div>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          <AnimatePresence mode="wait">
            {visiblePages.map((page, index) => (
              <motion.div
                key={`${page}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {page === "..." ? (
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </div>
                ) : (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page as number)}
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 p-0 font-medium transition-all duration-200",
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white shadow-lg"
                          : "border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-950",
                      )}
                    >
                      <motion.span
                        initial={false}
                        animate={{
                          scale: currentPage === page ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {page}
                      </motion.span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              "h-9 w-9 sm:h-10 sm:w-10 p-0 border-2 transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-950",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-background",
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </motion.div>
      </div>

      {/* Mobile-only compact view */}
      <div className="sm:hidden flex items-center justify-between w-full max-w-xs mx-auto mt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-3 py-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        </motion.div>

        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Page</span>
          <motion.span
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold text-blue-600 dark:text-blue-400"
          >
            {currentPage}
          </motion.span>
          <span>of {totalPages}</span>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-3 py-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </nav>
  )
}