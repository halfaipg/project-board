import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    env_check: {
      KV_REST_API_URL_exists: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN_exists: !!process.env.KV_REST_API_TOKEN,
      KV_REST_API_READ_ONLY_TOKEN_exists: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
      KV_REST_API_URL_first_chars: process.env.KV_REST_API_URL?.substring(0, 30) || 'NOT_SET',
      KV_REST_API_TOKEN_first_chars: process.env.KV_REST_API_TOKEN?.substring(0, 10) || 'NOT_SET',
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV
    }
  });
} 