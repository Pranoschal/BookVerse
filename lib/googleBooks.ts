const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export async function searchBooks(query: string): Promise<GoogleBook[]> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
  );

  if (!res.ok) throw new Error("Failed to fetch books");

  const data = await res.json();
  return data.items || [];
}
