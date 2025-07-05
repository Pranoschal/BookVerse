"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Star, Calendar, FileText, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Book {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  genre: string
  description: string
  pages: number
  publishYear: number
  status: "none" | "wishlist" | "readLater" | "read"
}

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBook: (book: Omit<Book, "id">) => void
  onEditBook?: (book: Book) => void
  editingBook?: Book | null
  mode: "add" | "edit"
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Science",
  "Philosophy",
  "Poetry",
  "Drama",
  "Horror",
  "Adventure",
  "Memoir",
  "Travel",
  "Cooking",
]

export default function BookModalComponent({
  isOpen,
  onClose,
  onAddBook,
  onEditBook,
  editingBook,
  mode,
}: BookModalProps) {
  const [formData, setFormData] = useState<Book>({
    id: "",
    title: "",
    author: "",
    cover: "",
    rating: 0,
    genre: "",
    description: "",
    pages: 0,
    publishYear: new Date().getFullYear(),
    status: "none",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({})

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && editingBook) {
      setFormData(editingBook)
    } else {
      setFormData({
        id: "",
        title: "",
        author: "",
        cover: "",
        rating: 0,
        genre: "",
        description: "",
        pages: 0,
        publishYear: new Date().getFullYear(),
        status: "none",
      })
    }
  }, [mode, editingBook, isOpen])

  const handleInputChange = (field: keyof Book, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Book, string>> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.genre) newErrors.genre = "Genre is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.pages <= 0) newErrors.pages = "Pages must be greater than 0"
    if (formData.publishYear < 1000 || formData.publishYear > new Date().getFullYear() + 10)
      newErrors.publishYear = "Please enter a valid year"
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = "Rating must be between 0 and 5"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const bookToSubmit = {
        ...formData,
        cover: formData.cover || "/placeholder.svg?height=300&width=200",
      }

      if (mode === "edit" && onEditBook && formData.id) {
        onEditBook(bookToSubmit as Book)
      } else {
        const { id, ...bookWithoutId } = bookToSubmit
        onAddBook(bookWithoutId)
      }

      // Reset form
      setFormData({
        id: "",
        title: "",
        author: "",
        cover: "",
        rating: 0,
        genre: "",
        description: "",
        pages: 0,
        publishYear: new Date().getFullYear(),
        status: "none",
      })
      setErrors({})
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form and errors when closing
    setFormData({
      id: "",
      title: "",
      author: "",
      cover: "",
      rating: 0,
      genre: "",
      description: "",
      pages: 0,
      publishYear: new Date().getFullYear(),
      status: "none",
    })
    setErrors({})
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-indigo-900/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-white via-purple-50/80 to-blue-50/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-200/50 shadow-purple-500/20"
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
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {mode === "edit" ? "Edit Book" : "Add to BookVerse"}
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      {mode === "edit" ? "Update your book details" : "Expand your reading universe"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 font-medium">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Book Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter book title"
                      className={`bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm sm:text-base ${
                        errors.title ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="w-4 h-4 text-blue-500" />
                      Author *
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Enter author name"
                      className={`bg-white/90 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm sm:text-base ${
                        errors.author ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
                  </div>

                  {/* Genre */}
                  <div className="space-y-2">
                    <Label htmlFor="genre" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      Genre *
                    </Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                      <SelectTrigger
                        className={`bg-white/90 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 ${
                          errors.genre ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre} className="hover:bg-emerald-50">
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Rating (0-5)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value) || 0)}
                      placeholder="4.5"
                      className={`bg-white/90 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 text-sm sm:text-base ${
                        errors.rating ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
                  </div>

                  {/* Pages */}
                  <div className="space-y-2">
                    <Label htmlFor="pages" className="flex items-center gap-2 text-gray-700 font-medium">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Pages *
                    </Label>
                    <Input
                      id="pages"
                      type="number"
                      min="1"
                      value={formData.pages}
                      onChange={(e) => handleInputChange("pages", Number.parseInt(e.target.value) || 0)}
                      placeholder="320"
                      className={`bg-white/90 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base ${
                        errors.pages ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
                  </div>

                  {/* Publish Year */}
                  <div className="space-y-2">
                    <Label htmlFor="publishYear" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      Publish Year *
                    </Label>
                    <Input
                      id="publishYear"
                      type="number"
                      min="1000"
                      max={new Date().getFullYear() + 10}
                      value={formData.publishYear}
                      onChange={(e) =>
                        handleInputChange("publishYear", Number.parseInt(e.target.value) || new Date().getFullYear())
                      }
                      placeholder="2023"
                      className={`bg-white/90 border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-300 text-sm sm:text-base ${
                        errors.publishYear ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.publishYear && <p className="text-red-500 text-sm">{errors.publishYear}</p>}
                  </div>
                </div>

                {/* Cover URL */}
                <div className="space-y-2">
                  <Label htmlFor="cover" className="flex items-center gap-2 text-gray-700 font-medium">
                    <BookOpen className="w-4 h-4 text-teal-500" />
                    Cover Image URL (Optional)
                  </Label>
                  <Input
                    id="cover"
                    value={formData.cover}
                    onChange={(e) => handleInputChange("cover", e.target.value)}
                    placeholder="https://example.com/book-cover.jpg"
                    className="bg-white/90 border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-sm sm:text-base"
                  />
                  <p className="text-gray-500 text-sm">Leave empty to use a placeholder image</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 font-medium">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter a brief description of the book..."
                    rows={3}
                    className={`bg-white/90 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none text-sm sm:text-base ${
                      errors.description ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2 text-gray-700 font-medium">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    Reading Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                    <SelectTrigger className="bg-white/90 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm">
                      <SelectItem value="none">No Status</SelectItem>
                      <SelectItem value="wishlist">Add to Wishlist</SelectItem>
                      <SelectItem value="readLater">Read Later</SelectItem>
                      <SelectItem value="read">Already Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 bg-white/80 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {mode === "edit" ? "Update Book" : "Add Book"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
