'use client';

import React, { useState } from 'react';
import { Address } from '@/types';
import Button from '@/components/ui/Button';

interface AddressManagementProps {
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onUpdateAddress: (index: number, address: Address) => void;
  onDeleteAddress: (index: number) => void;
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // ✅ Ensure Address includes isDefault
  const emptyAddress: Address = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  };

  const [currentAddress, setCurrentAddress] = useState<Address>({ ...emptyAddress });

  const handleAddAddress = () => {
    onAddAddress(currentAddress);
    setIsAdding(false);
    setCurrentAddress({ ...emptyAddress });
  };

  const handleUpdateAddress = () => {
    if (editingIndex !== null) {
      onUpdateAddress(editingIndex, currentAddress);
      setEditingIndex(null);
      setCurrentAddress({ ...emptyAddress });
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setCurrentAddress({ ...addresses[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setCurrentAddress({ ...emptyAddress });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Addresses</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your shipping addresses</p>
      </div>

      <div className="border-t border-gray-200">
        {addresses.length === 0 && !isAdding && (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No addresses found. Add your first address.</p>
          </div>
        )}

        <ul className="divide-y divide-gray-200">
          {addresses.map((address, index) => (
            <li key={index} className="px-4 py-5 sm:px-6">
              {editingIndex === index ? (
                <AddressForm
                  address={currentAddress}
                  setAddress={setCurrentAddress}
                  onSave={handleUpdateAddress}
                  onCancel={handleCancel}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{address.street}</p>
                    <p className="mt-1 text-sm text-gray-500">{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                    <p className="mt-1 text-sm text-gray-500">{address.country}</p>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleEditClick(index)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteAddress(index)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}

          {isAdding && (
            <li className="px-4 py-5 sm:px-6">
              <AddressForm
                address={currentAddress}
                setAddress={setCurrentAddress}
                onSave={handleAddAddress}
                onCancel={handleCancel}
              />
            </li>
          )}
        </ul>

        <div className="px-4 py-5 sm:px-6">
          {!isAdding && editingIndex === null && (
            <Button
              onClick={() => {
                setIsAdding(true);
                setCurrentAddress({ ...emptyAddress });
              }}
            >
              Add New Address
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Extracted form as reusable component
interface AddressFormProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  onSave: () => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress, onSave, onCancel }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div className="sm:col-span-4">
        <label className="block text-sm font-medium text-gray-700">Street address</label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">State / Province</label>
        <input
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
        <input
          type="text"
          value={address.zipCode}
          onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:col-span-6 flex items-center">
        <input
          id="default"
          type="checkbox"
          checked={address.isDefault}
          onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="default" className="ml-2 block text-sm text-gray-900">
          Set as default address
        </label>
      </div>
    </div>

    <div className="flex space-x-3">
      <Button onClick={onSave}>Save</Button>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
    </div>
  </div>
);

export default AddressManagement;
