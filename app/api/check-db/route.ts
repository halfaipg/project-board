import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get raw values directly from KV
    const keys = await kv.keys('*');
    
    // Collect all data
    const data: Record<string, any> = {};
    
    for (const key of keys) {
      data[key] = await kv.get(key);
    }
    
    // Check specifically for our board data
    const sections = await kv.get('board_sections');
    const comments = await kv.get('board_comments');
    
    return NextResponse.json({
      success: true,
      message: 'Database check',
      allKeys: keys,
      allData: data,
      boardData: {
        sectionsExists: sections !== null,
        commentsExists: comments !== null,
        sectionsType: sections ? typeof sections : 'null',
        commentsType: comments ? typeof comments : 'null',
        sectionsIsArray: Array.isArray(sections),
        commentsIsArray: Array.isArray(comments),
        // Only include sample data if they exist and are arrays
        sectionsSample: Array.isArray(sections) && sections.length > 0 ? sections[0] : null,
        commentsSample: Array.isArray(comments) && comments.length > 0 ? comments[0] : null
      }
    });
  } catch (error: any) {
    console.error('Error checking database:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 