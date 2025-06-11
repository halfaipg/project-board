import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function GET() {
  try {
    console.log('=== DEBUG GET - checking KV retrieval ===');
    
    // Test 1: Direct KV get
    const sectionsResult = await kv.get('board_sections');
    const commentsResult = await kv.get('board_comments');
    
    console.log('Direct KV results:');
    console.log('- sectionsResult:', sectionsResult);
    console.log('- commentsResult:', commentsResult);
    console.log('- sectionsResult === null:', sectionsResult === null);
    console.log('- sectionsResult === undefined:', sectionsResult === undefined);
    console.log('- !sectionsResult:', !sectionsResult);
    console.log('- typeof sectionsResult:', typeof sectionsResult);
    
    // Test 2: Truthiness check
    const sectionsCheck = !sectionsResult;
    console.log('- sectionsCheck (!sectionsResult):', sectionsCheck);
    
    // Test 3: What would the logic return?
    let finalSections;
    if (!sectionsResult) {
      console.log('Logic would use initialSections');
      finalSections = initialSections;
    } else {
      console.log('Logic would use KV sections');
      finalSections = sectionsResult;
    }
    
    return NextResponse.json({
      debug: true,
      timestamp: new Date().toISOString(),
      kvResults: {
        sections: sectionsResult,
        comments: commentsResult
      },
      truthinessChecks: {
        sectionsIsNull: sectionsResult === null,
        sectionsIsUndefined: sectionsResult === undefined,
        sectionsIsFalsy: !sectionsResult,
        sectionsType: typeof sectionsResult
      },
      logicWouldReturn: {
        wouldUseInitial: !sectionsResult,
        finalSections: (Array.isArray(finalSections) && finalSections.length > 0) ? finalSections[0]?.title : 'NO TITLE OR EMPTY ARRAY'
      }
    });
    
  } catch (error: any) {
    console.error('Debug GET error:', error);
    return NextResponse.json({
      error: error.message,
      debug: true
    }, { status: 500 });
  }
} 