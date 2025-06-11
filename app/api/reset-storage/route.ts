import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function GET() {
  try {
    // First delete any existing data
    await kv.del('board_sections');
    await kv.del('board_comments');
    
    // Wait a moment to ensure deletion completes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Then set fresh data
    await kv.set('board_sections', initialSections);
    await kv.set('board_comments', initialComments);
    
    return NextResponse.json({
      success: true,
      message: 'Storage has been completely reset with fresh data'
    });
  } catch (error: any) {
    console.error('Error resetting storage:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 