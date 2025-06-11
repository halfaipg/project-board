import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function POST() {
  try {
    console.log('=== RESETTING KV STORE ===');
    
    // Delete existing keys that might be corrupted
    try {
      await kv.del('board_sections');
      console.log('Deleted board_sections key');
    } catch (e) {
      console.log('board_sections key deletion failed or key did not exist');
    }
    
    try {
      await kv.del('board_comments');
      console.log('Deleted board_comments key');
    } catch (e) {
      console.log('board_comments key deletion failed or key did not exist');
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set fresh data
    await kv.set('board_sections', initialSections);
    console.log('Set fresh board_sections');
    
    await kv.set('board_comments', initialComments);
    console.log('Set fresh board_comments');
    
    // Verify the data was set correctly
    const testSections = await kv.get('board_sections');
    const testComments = await kv.get('board_comments');
    
    return NextResponse.json({
      success: true,
      message: 'KV store reset successfully',
      verification: {
        sectionsSet: !!testSections,
        commentsSet: !!testComments,
        sectionsCount: Array.isArray(testSections) ? testSections.length : 0,
        commentsCount: Array.isArray(testComments) ? testComments.length : 0
      }
    });
    
  } catch (error: any) {
    console.error('Error resetting KV store:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 