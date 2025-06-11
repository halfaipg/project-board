import { NextResponse } from "next/server";
import { kvOperations } from '../../../lib/kv';
import { Comment } from '../../lib/initialData';

export async function GET() {
  try {
    console.log('=== RESET ENDPOINT CALLED ===');
    
    // Create default data directly here since we can't import from API routes
    const defaultSections = [
      {
        id: 'section1',
        title: 'Proof of Concept',
        tasks: []
      },
      {
        id: 'section2', 
        title: 'Development',
        tasks: []
      },
      {
        id: 'section3',
        title: 'Hyper Care', 
        tasks: []
      }
    ];
    const defaultComments: Comment[] = [];
    
    // Reset KV if configured
    if (!kvOperations.isDemo()) {
      await kvOperations.setBoth(defaultSections, defaultComments);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Data reset successful. Please refresh your browser to see the changes.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error resetting data: ' + error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 