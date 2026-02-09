import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/products
 * Admin-only: create a product. Requires Authorization: Bearer <Firebase ID token>.
 * Returns 401 if not logged in, 403 if not admin.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { name, description, price, category, subcategory, sizes, colors, images, inStock, isFeatured } = body as {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      subcategory?: string;
      sizes?: string[];
      colors?: string[];
      images?: string[];
      inStock?: number;
      isFeatured?: boolean;
    };

    if (!name || typeof price !== 'number' || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category' },
        { status: 400 }
      );
    }

    const admin = await import('firebase-admin');
    const { getFirestore } = await import('firebase-admin/firestore');
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKeyRaw) {
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: missing Firebase env' },
        { status: 500 }
      );
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = getFirestore(admin.app());
    const now = new Date();
    const docRef = await db.collection('products').add({
      name,
      description: description ?? '',
      price,
      category,
      subcategory: subcategory ?? null,
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      images: Array.isArray(images) ? images : [],
      inStock: typeof inStock === 'number' ? inStock : 0,
      isFeatured: Boolean(isFeatured),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Admin products API error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
