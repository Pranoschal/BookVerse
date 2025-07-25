"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Calendar, FileText, User, BookOpen, Heart, CheckCircle, Globe, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book } from "@/types-interfaces/types"

interface BookDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book | null
}

export default function RecommendedBookDetailsModal({
  isOpen,
  onClose,
  book
}: BookDetailsModalProps) {
  if (!book) return null

  const getStatusColor = (status: Book["status"]) => {
    switch (status) {
      case "wishlist":
        return "from-pink-500 to-rose-500"
      case "readLater":
        return "from-emerald-500 to-teal-500"
      case "read":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getStatusText = (status: Book["status"]) => {
    switch (status) {
      case "wishlist":
        return "In Wishlist"
      case "readLater":
        return "Read Later"
      case "read":
        return "Completed"
      default:
        return "No Status"
    }
  }

  const getStatusIcon = (status: Book["status"]) => {
    switch (status) {
      case "wishlist":
        return <Heart className="w-4 h-4 fill-current" />
      case "readLater":
        return <BookOpen className="w-4 h-4" />
      case "read":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-indigo-900/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-white via-purple-50/80 to-blue-50/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-200/50 shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 text-white p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-transparent to-blue-800/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Book Details</h2>
                    <p className="text-blue-100 text-xs sm:text-sm">Complete book information</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Book Cover */}
                <div className="lg:col-span-1">
                  <div className="relative group">
                    <img
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full max-w-sm mx-auto lg:max-w-none h-auto object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 flex justify-center">
                    <Badge
                      className={`bg-gradient-to-r ${getStatusColor(
                        book.status,
                      )} text-white border-0 shadow-lg px-4 py-2 text-sm font-medium`}
                    >
                      {getStatusIcon(book.status)}
                      <span className="ml-2">{getStatusText(book.status)}</span>
                    </Badge>
                  </div>
                </div>

                {/* Book Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title and Author */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {book.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-base text-gray-500 mb-4">{book.publisher}</p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-md">
                      {book.genre}
                    </Badge>
                  </div>

                  {/* Book Stats - Redesigned Layout */}
                  <div className="space-y-4">
                    {/* First Row - Rating, Pages, Published */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200/50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-600">Rating</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{book.rating}</p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-600">Pages</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{book.pages}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-600">Published</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{book.publishYear}</p>
                      </div>
                    </div>

                    {/* Second Row - Language and Publisher */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl border border-green-200/50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Globe className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-gray-600">Language</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800">{book.language}</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200/50 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Building className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-medium text-gray-600">Publisher</span>
                        </div>
                        <p className="text-base font-bold text-gray-800 leading-tight px-2">{book.publisher}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 sm:p-6 rounded-xl border border-gray-200/50 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{book.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
