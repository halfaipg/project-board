import { NextResponse } from "next/server";
import { kvOperations } from '../../../../lib/kv';

// Import initial data from server-compatible file
import { initialSections, initialComments } from '../../../lib/initialData';

export async function GET() {
  console.log('=== API /board/get called ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('Attempting to fetch from KV store using unified operations...');
    
    // Use unified KV operations
    const sections = await kvOperations.getSections();
    const comments = await kvOperations.getComments();

    // NEVER INITIALIZE - only return what's found or fallback to initial data for display
    // This prevents overwriting existing data in other KV instances
    const finalSections = sections || initialSections;
    const finalComments = comments || initialComments;
    
    console.log('Returning data - sections source:', sections ? 'KV' : 'FALLBACK');
    console.log('Returning data - comments source:', comments ? 'KV' : 'FALLBACK');
    
    const response = { 
      sections: finalSections, 
      comments: finalComments 
    };
    
    console.log('Returning response with:');
    console.log('- sections count:', Array.isArray(finalSections) ? finalSections.length : 'not array');
    console.log('- comments count:', Array.isArray(finalComments) ? finalComments.length : 'not array');
    console.log('=== API /board/get completed successfully ===');
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('=== API /board/get ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Even in case of error, return valid data structures
    const fallbackResponse = { 
      sections: initialSections,
      comments: initialComments,
      error: 'Failed to fetch board data',
      errorDetails: error.message
    };
    
    console.log('Returning fallback response');
    console.log('=== API /board/get completed with error ===');
    
    return NextResponse.json(fallbackResponse, { status: 200 }); // Return 200 with fallback data instead of 500
  }
} 