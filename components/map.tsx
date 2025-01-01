'use client';

import React, { useEffect, useRef, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
  center?: [number, number];
  zoom?: number;
}

const Map = forwardRef<HTMLDivElement, MapProps>(({ onLocationSelect, center = [55.7558, 37.6173], zoom = 13 }, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef(false);

  // Инициализация карты
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;

    // Fix Leaflet's icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: '/icons/marker.svg',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Создаем карту
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, zoom);

    // Добавляем тайлы
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Сохраняем ссылку на карту
    mapRef.current = map;
    isInitializedRef.current = true;

    // Очистка при размонтировании
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [center, zoom]);

  // Обработка клика по карте
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return () => {};

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Обновляем маркер
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
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

          onLocationSelect({
            address: address || 'Указать адрес',
            coordinates: { lat, lng }
          });
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        onLocationSelect({
          address: 'Указать адрес',
          coordinates: { lat, lng }
        });
      }
    };

    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [onLocationSelect]);

  // Обновление центра карты при изменении пропсов
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center || (center[0] === 55.7558 && center[1] === 37.6173)) return;

    map.setView(center, zoom);

    // Обновляем маркер при изменении центра
    if (markerRef.current) {
      markerRef.current.setLatLng(center);
    } else {
      markerRef.current = L.marker(center).addTo(map);
    }
  }, [center, zoom]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
});

Map.displayName = 'Map';

export default Map;
