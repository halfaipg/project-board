import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function GET() {
  try {
    // Directly set valid data in KV store
    await kv.set('board_sections', JSON.parse(JSON.stringify(initialSections)));
    await kv.set('board_comments', JSON.parse(JSON.stringify(initialComments)));
    
    // Verify data was set correctly
    const sections = await kv.get('board_sections');
    const comments = await kv.get('board_comments');
    
    return NextResponse.json({
      success: true,
      message: 'Valid data has been set in the database',
      verification: {
        sectionsExists: sections !== null,
        commentsExists: comments !== null,
        sectionsIsArray: Array.isArray(sections),
        commentsIsArray: Array.isArray(comments),
        sectionsLength: Array.isArray(sections) ? sections.length : 'not an array',
        commentsLength: Array.isArray(comments) ? comments.length : 'not an array'
      }
    });
  } catch (error: any) {
    console.error('Error setting valid data:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 