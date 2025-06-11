import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function GET() {
  try {
    // Initialize the KV store with our initial data
    await kv.set('board_sections', initialSections);
    await kv.set('board_comments', initialComments);
    
    return NextResponse.json({
      success: true,
      message: 'Data initialized successfully'
    });
  } catch (error: any) {
    console.error('Error initializing data:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 