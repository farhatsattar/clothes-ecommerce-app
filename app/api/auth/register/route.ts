
import { NextResponse } from 'next/server';
import { signupUser } from '@/app/firebase/auth'; // ✅ correct import

export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and display name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // ✅ Use signupUser instead of createUser
    const result = await signupUser(email, password, displayName);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
