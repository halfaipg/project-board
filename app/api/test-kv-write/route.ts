import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    console.log('=== KV WRITE TEST ===');
    console.log('Timestamp:', timestamp);
    
    // Test 1: Simple write
    const testKey = 'test_write_' + Date.now();
    const testValue = { message: 'Test write', timestamp };
    
    console.log('Writing test data...');
    await kv.set(testKey, testValue);
    console.log('Write completed');
    
    // Test 2: Immediate read back
    console.log('Reading back immediately...');
    const readBack = await kv.get(testKey);
    console.log('Read back:', readBack);
    
    // Test 3: List all keys to see what's in KV
    const allKeys = await kv.keys('*');
    console.log('All keys in KV:', allKeys);
    
    return NextResponse.json({
      success: true,
      timestamp,
      tests: {
        writeTest: {
          key: testKey,
          value: testValue,
          readBack,
          writeWorked: JSON.stringify(readBack) === JSON.stringify(testValue)
        },
        allKeys
      }
    });
    
  } catch (error: any) {
    console.error('KV Write test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp
    }, { status: 500 });
  }
} 