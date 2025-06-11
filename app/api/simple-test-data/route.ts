import { NextResponse } from "next/server";
import { initialSections, initialComments } from '../../lib/initialData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      sectionsCount: initialSections.length,
      commentsCount: initialComments.length,
      firstSection: initialSections[0]?.title,
      message: 'Data import working!'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 