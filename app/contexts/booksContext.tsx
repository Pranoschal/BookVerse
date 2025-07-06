"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type BooksContextType = {
    books: any[];
    setBooks: (books: any[]) => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const useBooks = () => {
    const context = useContext(BooksContext)
    if (!context) {
        throw new Error("useBooks must be used within a BooksProvider")
    }
    return context
}

export const BooksProvider = ({ children }: { children: ReactNode }) => {
    const [books, setBooks] = useState<any[]>([])

    return (
        <BooksContext.Provider value={{ books, setBooks }}>
            {children}
        </BooksContext.Provider>
    )
}