export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  description: string;
  pages: number;
  publisher : string
  publishYear: number;
  status: 'read' | 'unread';
  language: string;
}

// const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// export async function searchBooks(query: string): Promise<Book[]> {
//   const res = await fetch(
//     `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
//   );

//   if (!res.ok) throw new Error('Failed to fetch books');

//   const data = await res.json();

//   return (data.items || []).map((item: any): Book => {
//     const info = item.volumeInfo;

//     return {
//       id: item.id,
//       title: info.title || 'Unknown Title',
//       author: info.authors?.[0] || 'Unknown Author',
//       cover:
//         info.imageLinks?.thumbnail?.replace('http:', 'https:') ||
//         '/placeholder.svg?height=300&width=200',
//       rating: info.averageRating ?? 0,
//       genre: info.categories?.[0] || 'Unknown Genre',
//       description: info.description || 'No description available.',
//       pages: info.pageCount ?? 0,
//       publishYear: info.publishedDate
//         ? parseInt(info.publishedDate.substring(0, 4))
//         : 0,
//       status: 'unread', // Default, can later be updated by user
//       language: info.language || 'Unknown',
//     };
//   });
// }

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function searchBooks(query: string): Promise<Book[]> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
  );

  if (!res.ok) throw new Error('Failed to fetch books');

  const data = await res.json();

  return (data.items || []).map((item: any): Book => {
    const info = item.volumeInfo;
    return {
      id: item.id,
      title: info.title || 'Unknown Title',
      author: info.authors?.[0] || 'Unknown Author',
      cover:
        info.imageLinks?.thumbnail?.replace('http:', 'https:') ||
        '/placeholder.svg?height=300&width=200',
      rating: info.averageRating ?? 0,
      genre: info.categories?.[0] || 'Unknown Genre',
      description: info.description || 'No description available.',
      pages: info.pageCount ?? 0,
      publisher : info.publisher || 'Unknown Publisher',
      publishYear: info.publishedDate
        ? parseInt(info.publishedDate.substring(0, 4))
        : 0,
      status: 'unread', // Default, can later be updated by user
      language: info.language || 'Unknown',
    };
  });
}

