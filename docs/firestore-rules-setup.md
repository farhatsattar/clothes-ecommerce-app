# Firestore Security Rules – Fix "Missing or insufficient permissions"

The app uses Firestore from the **client SDK** (products, cart, orders, wishlist, etc.). If you see **FirebaseError: Missing or insufficient permissions**, your Firestore rules in the Firebase Console are likely too strict or default (deny all).

## 1. Rules file in this repo

Project root includes **`firestore.rules`**, which defines access for:

- **products** – read: everyone; write: admin only  
- **users/{userId}** – read/write own profile; admins can read any user  
- **users/{userId}/orders** – read/write own orders  
- **users/{userId}/cart** – read/write own cart  
- **users/{userId}/wishlist** – read/write own wishlist  
- **collectionGroup('orders')** – read: admin only (admin orders page)  
- **products/{productId}/ratings** – read: everyone; write: authenticated (own rating)

## 2. Deploy rules to Firebase

### Option A: Firebase CLI (recommended)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. In the **project root** (where `firestore.rules` is), run:
   ```bash
   firebase init firestore
   ```
   - Choose “Use an existing project” and select your project.
   - When asked for `firestore.rules`, accept the default (e.g. `firestore.rules`) so it uses this file.
   - When asked for `firestore.indexes`, you can accept the default or create one later for `orders` if needed.
4. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option B: Copy rules in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/) → your project → **Firestore Database** → **Rules**.
2. Open **`firestore.rules`** in this repo and copy its full contents.
3. Paste into the Console editor and click **Publish**.

## 3. Admin custom claim

Admin-only rules use **`request.auth.token.admin == true`**. Set that claim for admin users (e.g. via Firebase Admin SDK or a one-off script like `setAdmin.js` in this repo). Until the claim is set, admin routes and collection group reads will still get “Missing or insufficient permissions” for non-owner data.

## 4. Collection group index (Admin Orders page)

The **Admin Orders** page uses `collectionGroup('orders')` with `orderBy('createdAt', 'desc')`. Firestore requires a **collection group** index (not a regular collection index).

### Important: Collection group vs Collection

- **Collection** index = for a single collection path (e.g. `users/abc/orders`). Does **not** work for `collectionGroup('orders')`.
- **Collection group** index = for all subcollections named `orders` anywhere. This is what you need.

If you created an index and the error persists, the index was likely created as **Collection** instead of **Collection group**. Create a new index with **Collection group** (see below).

### Option A: Create index in Firebase Console (correct way)

1. Open the **Create index** link from the error message, or go to [Firebase Console](https://console.firebase.google.com/) → your project → **Firestore** → **Indexes** → **Add index**.
2. Set **Collection ID** to `orders`.
3. **Query scope**: select **Collection group** (not “Collection”). This is required.
4. Add a field: **Field path** `createdAt`, **Order** `Descending`.
5. Click **Create**. Wait a few minutes for the index to build (status appears in the Indexes tab).

### Option B: Deploy indexes with Firebase CLI

The repo includes **`firestore.indexes.json`** with the correct collection group index. From the project root:

```bash
firebase init firestore   # if not done already; choose existing project
firebase deploy --only firestore:indexes
```

Or deploy rules and indexes together:

```bash
firebase deploy --only firestore
```

## 5. After updating rules / indexes

- Reload the app and retry the action that failed.
- In the browser console, check the exact path and operation (read/write) if errors persist.
- In Firebase Console → Firestore → **Rules**, use the **Rules Playground** to test read/write for a path and auth UID.
- For index errors, wait a few minutes after creating the index; build status is shown in Firestore → **Indexes**.
