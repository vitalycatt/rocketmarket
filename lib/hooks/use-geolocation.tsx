'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/language-context';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionState | null;
}

export function useGeolocation() {
  const { t } = useLanguage();
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionStatus: null,
  });

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: t('geolocationNotSupported'),
        loading: false,
      }));
      return;
    }

    let watchId: number | null = null;

    const setupGeolocation = async () => {
      try {
        // Проверяем статус разрешения
        let permissionStatus: PermissionState | null = null;
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          permissionStatus = permission.state;
          setState(prev => ({ ...prev, permissionStatus }));
        } catch (permError) {
          console.warn('Permission query not supported:', permError);
        }

        // Запрашиваем геолокацию с watchPosition для постоянного отслеживания
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setState(prev => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              loading: false,
              permissionStatus: permissionStatus,
            }));
          },
          (error) => {
            let errorMessage = t('geolocationError');
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = t('geolocationPermissionDenied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = t('geolocationUnavailable');
                break;
              case error.TIMEOUT:
                errorMessage = t('geolocationTimeout');
                break;
            }
            setState(prev => ({
              ...prev,
              error: errorMessage,
              loading: false,
            }));
          },
          {
            enableHighAccuracy: true,
            timeout: 30000, // Увеличиваем timeout до 30 секунд
            maximumAge: 1000, // Разрешаем использовать кэшированную позицию возрастом до 1 секунды
          }
        );
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: t('geolocationError'),
          loading: false,
        }));
      }
    };

    // Запускаем настройку геолокации
    setupGeolocation();

    // Возвращаем функцию очистки
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [t]);

  useEffect(() => {
    const cleanup = requestGeolocation();
    return cleanup;
  }, [requestGeolocation]);

  return {
    ...state,
    requestGeolocation,
  };
}
