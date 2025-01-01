'use client'

import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { Menu, Transition } from '@headlessui/react';
import { User2, LogOut } from 'lucide-react';
import { PhoneVerificationModal } from './phone-verification-modal';
import { cn } from '@/lib/utils';
import { ShoppingCart, Search, MapPin, Bell, FileText, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cart } from '@/components/cart';
import { useAddress } from '@/lib/address-context';
import { AddressDrawer } from '@/components/address-drawer';
import { Logo } from '@/components/ui/logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AddressBarProps {
  setIsAddressDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchInput() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative w-full max-w-md group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-all duration-200" />
        <Input
          type="search"
          placeholder={t('searchProducts')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-gray-400"
        />
      </div>
    </form>
  );
}

export function AddressBar({ setIsAddressDrawerOpen }: AddressBarProps) {
  const { t } = useLanguage();
  const { address } = useAddress();

  return (
    <div className="bg-gray-100 py-2.5">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button
          onClick={() => setIsAddressDrawerOpen(true)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200 group py-1"
        >
          <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium truncate max-w-[300px] group-hover:text-primary transition-colors duration-200">
            {address?.fullAddress || t('addressNotSpecified')}
          </span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddressDrawerOpen(true)}
          className="text-gray-500 hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
          {t('change')}
        </Button>
      </div>
    </div>
  );
}

export function ProfileMenu() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    await router.push('/');
    window.location.reload();
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <User2 className="h-5 w-5" />
            <span className="sr-only">{t('profile')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {!user ? (
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <User2 className="mr-2 h-4 w-4" />
              <span>{t('login')}</span>
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  {user.name && <span className="font-medium">{user.name}</span>}
                  {user.phone && <span className="text-sm text-gray-500">{user.phone}</span>}
                  {user.email && <span className="text-sm text-gray-500">{user.email}</span>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=account" className="flex items-center w-full">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>{t('account')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=notifications" className="flex items-center w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>{t('notifications')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=orders" className="flex items-center w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>{t('orders')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=contracts" className="flex items-center w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{t('contracts')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PhoneVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export function Header() {
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <AddressBar setIsAddressDrawerOpen={setIsAddressDrawerOpen} />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="hidden md:block">
            <Logo />
          </div>
          <div className="md:hidden">
            <Logo variant="mobile" />
          </div>
          <div className="flex-1 mx-4">
            <SearchInput />
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <ProfileMenu />
            </div>
            <Cart>
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 hover:bg-primary/5 active:scale-95 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in-50 duration-200">
                  0
                </span>
              </Button>
            </Cart>
          </div>
        </div>
      </div>
      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        onSave={(addressData) => {
          setIsAddressDrawerOpen(false);
        }}
      />
    </header>
  );
}
