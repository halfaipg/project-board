import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

// Function to remove undefined values from objects
function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      // Replace undefined with null, which is valid JSON
      result[key] = obj[key] === undefined ? null : sanitizeData(obj[key]);
    }
    return result;
  }
  
  return obj;
}

export async function GET() {
  try {
    // Get the original data
    const originalSections = sanitizeData(initialSections);
    const originalComments = sanitizeData(initialComments);
    
    // Store the sanitized data in KV
    await kv.set('board_sections', originalSections);
    await kv.set('board_comments', originalComments);
    
    return NextResponse.json({
      success: true,
      message: 'Data has been fixed and sanitized',
      sanitizedData: {
        sections: originalSections,
        comments: originalComments
      }
    });
  } catch (error: any) {
    console.error('Error fixing JSON issues:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 