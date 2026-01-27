# Quickstart Guide: Clothes E-Commerce App

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Firebase account with project created
- WhatsApp Business Account with Twilio setup (for production)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ecommerce-app
npm install
# or
yarn install
```

### 2. Firebase Configuration

Create a `.env.local` file in the project root with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# For WhatsApp integration (production)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=your_whatsapp_number
```

### 3. Initialize Firebase Services

```bash
# If using Firebase CLI tools
npm install -g firebase-tools
firebase login
firebase init
```

## Development Setup

### 1. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 2. Database Setup

Initialize your Firestore database with the required collections:

- `users` - Store user account information
- `products` - Store product catalog
- `orders` - Store order information
- `chatsessions` - Store WhatsApp chat sessions

## Key Features Setup

### Product Management

Products can be added via the Firebase Console or through an admin interface (to be developed in Phase 2).

Sample product document structure:
```javascript
{
  id: "product-id",
  name: "Men's Cotton T-Shirt",
  description: "Comfortable cotton t-shirt for everyday wear",
  price: 1999, // $19.99 in cents
  category: "men",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White", "Blue"],
  images: ["https://storage.googleapis.com/.../tshirt.jpg"],
  inStock: 50,
  isActive: true
}
```

### WhatsApp Integration

The WhatsApp bot endpoint is available at `/api/whatsapp-webhook`. For development, you can test with:

```bash
curl -X POST http://localhost:3000/api/whatsapp-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+1234567890&Body=hello"
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/[category]` - Get products by category
- `GET /api/products/[id]` - Get specific product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/[userId]` - Get user's orders
- `GET /api/orders/[orderId]` - Get specific order

### WhatsApp
- `POST /api/whatsapp-webhook` - WhatsApp message webhook

## Testing

### Run Unit Tests

```bash
npm run test
# or
yarn test
```

### Run End-to-End Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Deploy: `vercel --prod`

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Firebase configuration variables
- Twilio credentials for WhatsApp integration
- Any additional API keys

## Troubleshooting

### Common Issues

1. **Firebase Authentication Not Working**
   - Verify Firebase configuration in environment variables
   - Check Firebase Console for authentication method enablement

2. **WhatsApp Bot Not Responding**
   - Verify Twilio credentials
   - Check webhook URL is properly configured in Twilio Console
   - Ensure endpoint is publicly accessible

3. **Images Not Loading**
   - Verify Firebase Storage permissions
   - Check image URLs in product documents

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check Firebase Console for real-time database updates
- Monitor the server console for API request logs

## Next Steps

1. Add products to your database through Firebase Console
2. Test the complete shopping flow
3. Set up WhatsApp Business API with Twilio for production
4. Customize the UI with your branding elements