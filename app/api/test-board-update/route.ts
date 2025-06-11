import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log('=== TEST BOARD UPDATE ===');
  
  try {
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    const { sections, comments } = body;
    
    console.log('Extracted data:');
    console.log('- sections:', sections ? `${sections.length} items` : 'null/undefined');
    console.log('- comments:', comments ? `${comments.length} items` : 'null/undefined');
    
    // Check what's currently in KV
    const currentSections = await kv.get('board_sections');
    const currentComments = await kv.get('board_comments');
    
    console.log('Current KV data:');
    console.log('- current sections:', currentSections ? `${Array.isArray(currentSections) ? currentSections.length : 'not array'} items` : 'null');
    console.log('- current comments:', currentComments ? `${Array.isArray(currentComments) ? currentComments.length : 'not array'} items` : 'null');
    
    // Try the update
    console.log('Attempting KV update...');
    
    await kv.set('board_sections', sections);
    console.log('✅ board_sections set');
    
    await kv.set('board_comments', comments);
    console.log('✅ board_comments set');
    
    // Immediately verify
    const verifySections = await kv.get('board_sections');
    const verifyComments = await kv.get('board_comments');
    
    console.log('Immediate verification:');
    console.log('- verified sections:', verifySections ? `${Array.isArray(verifySections) ? verifySections.length : 'not array'} items` : 'null');
    console.log('- verified comments:', verifyComments ? `${Array.isArray(verifyComments) ? verifyComments.length : 'not array'} items` : 'null');
    
    // Check if data actually changed
    const sectionsChanged = JSON.stringify(currentSections) !== JSON.stringify(verifySections);
    const commentsChanged = JSON.stringify(currentComments) !== JSON.stringify(verifyComments);
    
    console.log('Change detection:');
    console.log('- sections changed:', sectionsChanged);
    console.log('- comments changed:', commentsChanged);
    
    return NextResponse.json({
      success: true,
      debug: {
        receivedSections: sections ? sections.length : 0,
        receivedComments: comments ? comments.length : 0,
        currentSections: currentSections ? (Array.isArray(currentSections) ? currentSections.length : 'not array') : 'null',
        currentComments: currentComments ? (Array.isArray(currentComments) ? currentComments.length : 'not array') : 'null',
        verifiedSections: verifySections ? (Array.isArray(verifySections) ? verifySections.length : 'not array') : 'null',
        verifiedComments: verifyComments ? (Array.isArray(verifyComments) ? verifyComments.length : 'not array') : 'null',
        sectionsChanged,
        commentsChanged
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error in test update:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 