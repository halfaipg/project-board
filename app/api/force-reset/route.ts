import { NextResponse } from "next/server";
import { kvOperations } from '../../../lib/kv';
import { initialSections, initialComments } from '../../lib/initialData';

export async function POST() {
  try {
    console.log('=== FORCE RESET - Overwriting all KV data ===');
    
    // Force overwrite KV data using unified operations
    const success = await kvOperations.setBoth(initialSections, initialComments);
    
    if (success) {
      console.log('KV data force reset completed');
      
      return NextResponse.json({
        success: true,
        message: 'KV data force reset completed',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Failed to reset KV data');
    }
    
  } catch (error: any) {
    console.error('Force reset error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 