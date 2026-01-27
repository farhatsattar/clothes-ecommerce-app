'use client';
import React from 'react';

interface Props {
  phone?: string; // default WhatsApp number
}

const WhatsAppFloatingButton: React.FC<Props> = ({ phone = '923014440787' }) => {
  const message = encodeURIComponent(
    `Hello 👋 / Assalam o Alaikum\n\nI want to chat regarding my order.`
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50"
    >
      <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center animate-bounce">
        <img
          src="/icons/whatsapp_icon.png"
          alt="WhatsApp"
          className="w-6 h-6"
        />
      </div>
    </a>
  );
};

export default WhatsAppFloatingButton;
