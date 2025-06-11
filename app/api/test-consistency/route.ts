import { NextResponse } from "next/server";
import { kvOperations } from '../../../lib/kv';

export async function POST() {
  try {
    const testData = [{
      id: "test",
      title: `CONSISTENCY TEST ${Date.now()}`,
      tasks: []
    }];
    
    console.log('Writing test data:', testData[0].title);
    const writeSuccess = await kvOperations.setSections(testData);
    
    console.log('Reading back test data...');
    const readBack = await kvOperations.getSections();
    
    return NextResponse.json({
      success: true,
      written: testData[0].title,
      writeSuccess: writeSuccess,
      readBack: Array.isArray(readBack) ? readBack[0]?.title : 'NOT_ARRAY',
      matches: JSON.stringify(testData) === JSON.stringify(readBack),
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 