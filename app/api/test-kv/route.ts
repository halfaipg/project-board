import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

// A simple test endpoint to verify KV is working
export async function GET() {
  try {
    // Set a test value
    await kv.set('test_key', 'KV is working!');
    
    // Get the test value
    const testValue = await kv.get('test_key');
    
    // Get the current board data
    const sections = await kv.get('board_sections');
    const comments = await kv.get('board_comments');
    
    return NextResponse.json({
      success: true,
      testValue,
      hasData: {
        sections: !!sections,
        comments: !!comments
      },
      dataTypes: {
        sections: sections ? typeof sections : 'undefined',
        comments: comments ? typeof comments : 'undefined'
      }
    });
  } catch (error: any) {
    console.error('KV test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 