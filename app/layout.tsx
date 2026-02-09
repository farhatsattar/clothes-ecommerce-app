import { CartProvider } from '../lib/context/cart-context';
import { AuthProvider } from '../lib/context/auth-context';
import { WishlistProvider } from '../lib/context/wishlist-context';
import './globals.css';
import { ReactNode } from 'react';


export const metadata = {
  title: 'IBFashionHub - Clothes E-Commerce App',
  description: 'Shop for the latest fashion trends',
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
