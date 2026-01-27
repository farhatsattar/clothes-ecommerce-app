import React, { useState } from 'react';
import { Product } from '@/types';

interface ImageGalleryProps {
  product: Product;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '');

  return (
    <div className="flex flex-col">
      <div className="w-full aspect-square max-w-2xl mx-auto">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>No image available</span>
          </div>
        )}
      </div>

      {product.images && product.images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded-md overflow-hidden border-2 ${
                selectedImage === image ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;