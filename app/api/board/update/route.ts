import { NextResponse } from "next/server";
import { kvOperations } from '../../../../lib/kv';

function sanitizeForJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForJSON(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeForJSON(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

export async function POST(request: Request) {
  console.log('=== API /board/update called ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('Request body received');
    
    // Sanitize the data to prevent JSON issues
    const sanitizedSections = sanitizeForJSON(body.sections);
    const sanitizedComments = sanitizeForJSON(body.comments);
    
    console.log('Data sanitized:', {
      sectionsCount: Array.isArray(sanitizedSections) ? sanitizedSections.length : 'not array',
      commentsCount: Array.isArray(sanitizedComments) ? sanitizedComments.length : 'not array'
    });
    
    // Use unified KV operations
    const success = await kvOperations.setBoth(sanitizedSections, sanitizedComments);
    
    if (success) {
      console.log('=== API /board/update completed successfully ===');
      return NextResponse.json({ 
        success: true, 
        message: 'Board data updated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Failed to update KV store');
    }
    
  } catch (error: any) {
    console.error('=== API /board/update ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update board data',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 