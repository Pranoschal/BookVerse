import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: fetchedBooks, error } = await supabase.from("Books").select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true,
      data: fetchedBooks,
      count: fetchedBooks?.length || 0
    });
    
  } catch (err) {
    console.error('Server error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown Error Occured'
    return NextResponse.json({ 
      success: false,
      error: errorMessage || 'Internal server error' 
    }, { status: 500 });
  }
}