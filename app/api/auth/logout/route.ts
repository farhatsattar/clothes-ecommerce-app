import { NextResponse } from 'next/server';
import { logoutUser } from '@/app/firebase/auth'; // ✅ correct export from auth.ts

export async function POST(request: Request) {
  try {
    // Attempt to sign out the user
    await logoutUser();

    return NextResponse.json({
      success: true,
      message: 'Successfully signed out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
