import React, { useState } from 'react';
import { User } from '@/types';
import Button from '@/components/ui/Button';

interface ProfileManagementProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ user, onSave }) => {
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setSaving(true);

    // In a real implementation, this would update the user in Firestore
    // For now, we'll just call the onSave prop
    await onSave({ displayName, phoneNumber });

    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
        <p className="mt-1 text-sm text-gray-500">Update your personal information</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Display name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <span>{user.displayName}</span>
              )}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.email}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <span>{user.phoneNumber || 'Not provided'}</span>
              )}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Member since</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.createdAt ? user.createdAt.toLocaleDateString() : 'Unknown'}
            </dd>
          </div>
        </dl>

        <div className="px-4 py-5 sm:px-6">
          {isEditing ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={saving}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDisplayName(user.displayName);
                  setPhoneNumber(user.phoneNumber || '');
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;