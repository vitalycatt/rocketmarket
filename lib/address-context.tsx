'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AddressData {
  fullAddress: string;
  details?: string;
  coordinates?: { lat: number; lng: number };
}

interface AddressContextType {
  address: AddressData | undefined;
  setAddress: (address: AddressData | undefined) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<AddressData | undefined>();

  // Загружаем адрес из localStorage при инициализации
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error('Error parsing saved address:', error);
      }
    }
  }, []);

  // Сохраняем адрес в localStorage при изменении
  const handleSetAddress = (newAddress: AddressData | undefined) => {
    setAddress(newAddress);
    if (newAddress) {
      localStorage.setItem('userAddress', JSON.stringify(newAddress));
    } else {
      localStorage.removeItem('userAddress');
    }
  };

  return (
    <AddressContext.Provider value={{ address, setAddress: handleSetAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
