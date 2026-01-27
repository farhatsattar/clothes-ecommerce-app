'use client';

import { useState } from 'react';
import { addProduct } from '@/firebase/firestore';
import Button from '@/components/ui/Button';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'men', // Default category
    sizes: [],
    colors: [],
    inStock: 0,
    isFeatured: false,
    image: '' // Image path in public folder
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inStock' ? Number(value) : value
    }));
  };

  const handleAdd = async () => {
    if (!formData.image) {
      alert('Please enter an image path');
      return;
    }

    try {
      // Prepare product data
      const productData = {
        ...formData,
        price: Number(formData.price) * 100, // Convert to cents
        images: [formData.image], // Store as array
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      // Add product to Firestore
      await addProduct(productData);

      alert('Product added successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'men',
        sizes: [],
        colors: [],
        inStock: 0,
        isFeatured: false,
        image: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="juniors">Juniors</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">In Stock *</label>
            <input
              type="number"
              name="inStock"
              value={formData.inStock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Path *</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="/images/product-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-600">Enter path to image in public folder (e.g., /images/p1.jpg)</p>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
          </div>

          <div className="mt-6">
            <Button
              variant="orange"
              fullWidth
              onClick={handleAdd}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
