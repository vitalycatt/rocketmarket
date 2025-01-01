"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MapPin, Navigation, PlusCircle, Minimize2, X } from 'lucide-react'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./map'), { ssr: false })

interface AddressData {
  fullAddress: string;
  details?: string;
  coordinates?: { lat: number; lng: number };
}

export function AddressDrawer({ isOpen, onClose, onSave }: AddressDrawerProps) {
  const { t } = useLanguage()
  const [address, setAddress] = useState<AddressData>({
    fullAddress: '',
    details: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isMapFullScreen, setIsMapFullScreen] = useState(false)
  const mapRef = useRef(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationSelect = (location: { address: string; coordinates: { lat: number; lng: number } }) => {
    setAddress(prev => ({
      ...prev,
      fullAddress: location.address,
      coordinates: location.coordinates
    }))
  }

  const handleGeolocation = () => {
    setIsLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'RocketMarket/1.0'
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              let address = '';

              // Формируем адрес из компонентов
              const components = [];
              if (data.address.house_number) components.push(data.address.house_number);
              if (data.address.road) components.push(data.address.road);
              if (data.address.suburb) components.push(data.address.suburb);
              if (data.address.city || data.address.town || data.address.village) {
                components.push(data.address.city || data.address.town || data.address.village);
              }

              address = components.join(', ');

              if (!address && data.display_name) {
                address = data.display_name;
              }

              setAddress(prev => ({
                ...prev,
                fullAddress: address || t('enterAddress'),
                coordinates: coords
              }));
            } else {
              throw new Error('Failed to fetch address');
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            setAddress(prev => ({
              ...prev,
              fullAddress: t('enterAddress'),
              coordinates: coords
            }));
          }

          setIsLoading(false);
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.fullAddress) {
      return
    }
    onSave(address)
    onClose()
  }

  const toggleMapSize = () => {
    setIsMapFullScreen(!isMapFullScreen)
  }

  useEffect(() => {
    if (address.coordinates) {
      if (mapRef.current) {
        // @ts-ignore
        mapRef.current.setView([address.coordinates.lat, address.coordinates.lng], 16);
      }
    }
  }, [address.coordinates]);

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent
        className="w-full sm:w-full"
        aria-describedby="address-drawer-description"
        aria-labelledby="address-drawer-title"
      >
        <div className="flex flex-col h-full">
          <div className="w-full p-6 bg-white flex flex-col gap-4 overflow-y-auto">
            <SheetHeader>
              <SheetTitle id="address-drawer-title" className="text-2xl font-bold text-gray-800">
                {t('addressDrawerTitle')}
              </SheetTitle>
              <p id="address-drawer-description" className="text-gray-500 text-sm">
                {t('addressDrawerDescription')}
              </p>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between text-black hover:bg-gray-500/20"
                onClick={handleGeolocation}
                disabled={isLoading}
                aria-label={t('useCurrentLocation')}
              >
                <span>{isLoading ? t('determiningLocation') : t('currentLocation')}</span>
                <MapPin className={`h-5 w-5 text-black ${isLoading ? 'animate-pulse' : ''}`} />
              </Button>

              <div className="space-y-2">
                <Label className="text-gray-600 flex items-center gap-1">
                  {t('addressLabel')}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="fullAddress"
                  value={address.fullAddress}
                  onChange={handleInputChange}
                  placeholder={t('enterAddress')}
                  className="border-2 border-gray-300 focus:border-primary transition-colors rounded-xl py-3"
                  required
                  aria-required="true"
                />
                <p className="text-xs text-gray-500">{t('addressHelper')}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {t('apartmentDetailsLabel')}
                </Label>
                <Input
                  name="details"
                  value={address.details || ''}
                  onChange={handleInputChange}
                  placeholder={t('apartmentDetailsPlaceholder')}
                  className="border-2 border-gray-300 focus:border-primary transition-colors rounded-xl py-3"
                />
                <p className="text-xs text-gray-500">{t('apartmentDetailsHelper')}</p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl py-3 text-base hover:opacity-90 transition-opacity"
                disabled={!address.fullAddress}
                aria-label={t('saveAddressAria')}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {t('saveAddress')}
              </Button>
            </form>
          </div>

          <div className="relative flex-1">
            <div className={`relative ${isMapFullScreen ? 'fixed inset-0 z-50' : 'h-[300px] w-full'}`}>
              <Map
                ref={mapRef}
                onLocationSelect={handleLocationSelect}
                center={address.coordinates ? [address.coordinates.lat, address.coordinates.lng] : undefined}
              />
              <Button
                type="button"
                variant="outline"
                className="absolute top-2 right-2 z-10"
                onClick={toggleMapSize}
                aria-label={isMapFullScreen ? t('minimizeMap') : t('maximizeMap')}
              >
                {isMapFullScreen ? <Minimize2 className="h-4 w-4" /> : <Navigation className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface AddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressData) => void;
}
