import { kv } from '@vercel/kv';
import { NextResponse } from "next/server";

export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Check KV connection
  try {
    await kv.set('debug_test', 'connection_working');
    const testValue = await kv.get('debug_test');
    debugInfo.tests.push({
      name: 'KV Connection Test',
      status: testValue === 'connection_working' ? 'PASS' : 'FAIL',
      result: testValue
    });
  } catch (error: any) {
    debugInfo.tests.push({
      name: 'KV Connection Test',
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 2: Check board data existence and type
  try {
    const sections = await kv.get('board_sections');
    const comments = await kv.get('board_comments');
    
    debugInfo.tests.push({
      name: 'Board Data Check',
      status: 'PASS',
      sections: {
        exists: sections !== null,
        type: typeof sections,
        isArray: Array.isArray(sections),
        length: Array.isArray(sections) ? sections.length : 'not array',
        firstItem: Array.isArray(sections) && sections.length > 0 ? sections[0] : null
      },
      comments: {
        exists: comments !== null,
        type: typeof comments,
        isArray: Array.isArray(comments),
        length: Array.isArray(comments) ? comments.length : 'not array',
        firstItem: Array.isArray(comments) && comments.length > 0 ? comments[0] : null
      }
    });
  } catch (error: any) {
    debugInfo.tests.push({
      name: 'Board Data Check',
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 3: Test the actual /api/board/get endpoint internally
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/board/get`);
    const responseText = await response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      parsedResponse = 'Could not parse as JSON';
    }

    debugInfo.tests.push({
      name: 'Internal API Call Test',
      status: response.ok ? 'PASS' : 'FAIL',
      httpStatus: response.status,
      responseText: responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''),
      parsedResponse: parsedResponse
    });
  } catch (error: any) {
    debugInfo.tests.push({
      name: 'Internal API Call Test',
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 4: Environment variables check
  debugInfo.tests.push({
    name: 'Environment Variables Check',
    status: 'INFO',
    env: {
      KV_URL: process.env.KV_URL ? 'SET' : 'NOT SET',
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET'
    }
  });

  return NextResponse.json(debugInfo);
} 