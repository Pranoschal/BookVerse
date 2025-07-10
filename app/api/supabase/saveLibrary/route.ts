import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Parse the request body
    const body = await req.json();
    
    // Check if it's a single book or array of books
    const books = Array.isArray(body) ? body : [body];
    
    if (books.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'No books provided' 
      }, { status: 400 });
    }
    
    // Validate each book has required fields
    for (const book of books) {
      if (!book.title || !book.author) {
        return NextResponse.json({ 
          success: false,
          error: 'Each book must have title and author' 
        }, { status: 400 });
      }
    }
    
    // For bulk insert with conflict handling, use upsert
    const { data: savedBooks, error } = await supabase
      .from("Books")
      .upsert(
        books.map(book => ({
          id: book.id, // Include the ID from your data
          title: book.title,
          author: book.author,
          cover: book.cover,
          rating: book.rating,
          genre: book.genre,
          description: book.description,
          pages: book.pages,
          publishYear: book.publishYear,
          status: book.status,
          language: book.language,
          publisher: book.publisher,
        })),
        { 
          onConflict: 'id', 
          ignoreDuplicates: false 
        }
      )
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false,
        error: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: `${savedBooks?.length || 0} books saved successfully`,
      data: savedBooks,
      count: savedBooks?.length || 0
    }, { status: 201 });
    
  } catch (err) {
    console.error('Server error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown Error Occurred';
    return NextResponse.json({ 
      success: false,
      error: errorMessage 
    }, { status: 500 });
  }
}
