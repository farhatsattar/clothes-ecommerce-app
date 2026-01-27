import React from 'react';
import { Product } from '@/types';

interface VariantSelectorProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange
}) => {
  return (
    <div className="mt-8">
      {/* Size Selector */}
      <div className="mt-4">
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Size
        </label>
        <select
          id="size"
          name="size"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
        >
          {product.sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Color Selector */}
      <div className="mt-4">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <select
          id="color"
          name="color"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
        >
          {product.colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VariantSelector;