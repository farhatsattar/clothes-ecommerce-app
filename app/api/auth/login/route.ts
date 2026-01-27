import { NextResponse } from 'next/server';
// Change this to the correct exported function name
import { loginUser } from '@/app/firebase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Attempt to sign in the user using the correct function
    const result = await loginUser(email, password);

    if (!result.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Login failed'
        },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
