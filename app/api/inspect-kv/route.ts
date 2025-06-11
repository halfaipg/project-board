import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sections = await kv.get('board_sections');
    const comments = await kv.get('board_comments');
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      kvData: {
        board_sections: {
          exists: sections !== null,
          type: typeof sections,
          isArray: Array.isArray(sections),
          data: sections
        },
        board_comments: {
          exists: comments !== null,
          type: typeof comments,
          isArray: Array.isArray(comments),
          data: comments
        }
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
} 