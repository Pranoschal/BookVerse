import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/lib/googleBooks';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  console.log('PERFECT',query)
  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const books = await searchBooks(query);
    console.log(books,"CHECKED PERFECTLY")
    return NextResponse.json(books);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
