'use client';
import { useState } from 'react';

interface UserTypeSelectorProps {
  onUserTypeChange: (userType: string) => void;
}

export default function UserTypeSelector({ onUserTypeChange }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState('buyer');

  const handleChange = (userType: string) => {
    setSelectedType(userType);
    onUserTypeChange(userType);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleChange('buyer')}
        className={`px-4 py-2 rounded ${
          selectedType === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Buyer
      </button>
      <button
        onClick={() => handleChange('seller')}
        className={`px-4 py-2 rounded ${
          selectedType === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Seller
      </button>
      <button
        onClick={() => handleChange('transporter')}
        className={`px-4 py-2 rounded ${
          selectedType === 'transporter' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Transporter
      </button>
    </div>
  );
}
