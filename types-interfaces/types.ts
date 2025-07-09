import React from "react";

export type ViewMode = "grid" | "list"; 
export type ModalMode = "add" | "edit"
export type StatusCounts = {
  all: number;
  wishlist: number;
  readLater: number;
  read: number;
};

export type ActiveTab = string;

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  description: string;
  pages: number;
  publisher : string;
  publishYear: number;
  status: "none" | "wishlist" | "readLater" | "read";
  language: string;
}


export type VoidFunc = ()=>void;
export type BookFunc = (book:Book)=>void
export type BookIdFunc = (bookId:string) => void;
export type UpdateBookStatus = (bookId: string, newStatus: Book["status"]) => void;
export type AddNewBook = (newBook: Omit<Book, "id">) => void;
export type SetActiveTab = React.Dispatch<React.SetStateAction<string>>;
