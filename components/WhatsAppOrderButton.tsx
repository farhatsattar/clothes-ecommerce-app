'use client';

import React from 'react';
import { Product } from '@/types';
import { createOrder } from '@/firebase/orders';
import { useAuth } from '@/lib/context/auth-context';

interface Props {
  product: Product;
  size: string;
  color: string;
  qty: number;
}

const WhatsAppOrderButton: React.FC<Props> = ({
  product,
  size,
  color,
  qty,
}) => {
  const { user } = useAuth();
  const phone = '923014440787'; // WhatsApp Business number

  const message = `
Hello 👋 / Assalam o Alaikum

I want to place an order 👗

🧾 Product: ${product.name}
📏 Size: ${size}
🎨 Color: ${color}
🔢 Quantity: ${qty}
💰 Price: Rs. ${product.price}

📍 Delivery: Pakistan

Please guide me for payment:
1️⃣ Cash on Delivery
2️⃣ Online Payment
`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  const handleWhatsAppOrder = async () => {
    try {
      // 🔥 Save order to Firestore
      if (user) {
        await createOrder(user.uid, {
          items: [{
            productId: product.id,
            name: product.name,
            priceAtTime: product.price,
            quantity: qty,
            selectedSize: size,
            selectedColor: color,
          }],
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan',
          },
          paymentMethod: 'COD',
          totalAmount: product.price * qty,
          status: 'pending',
        });
      }

      // 🔗 Open WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      onClick={handleWhatsAppOrder}
      className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-700 transition font-semibold"
    >
      Order on WhatsApp
    </button>
  );
};

export default WhatsAppOrderButton;
