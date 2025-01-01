'use client';

import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useLanguage } from '@/lib/language-context';

export function GeolocationPrompt() {
  const { t } = useLanguage();
  const { permissionStatus, requestGeolocation } = useGeolocation();

  useEffect(() => {
    // Запрашиваем геолокацию только если разрешение еще не было дано или отклонено
    if (permissionStatus === null) {
      requestGeolocation();
    }
  }, [permissionStatus, requestGeolocation]);

  if (permissionStatus !== 'prompt') {
    return null;
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{t('allowGeolocation')}</DialogTitle>
          <DialogDescription className="text-center">
            {t('allowGeolocationDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={requestGeolocation} className="min-w-[120px]">
            {t('allow')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
