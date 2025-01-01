"use client"

import React from 'react'
import Link from 'next/link'
import { HomeIcon, ShoppingBagIcon, UserIcon, SearchIcon } from 'lucide-react'
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Cart } from "@/components/cart"

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  onClick?: () => void;
  component?: React.ComponentType<{ children: React.ReactNode }>;
}

export function MobileBottomMenu() {
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    {
      icon: HomeIcon,
      label: t('home'),
      href: "/"
    },
    {
      icon: SearchIcon,
      label: t('catalog'),
      href: "/catalog"
    },
    {
      icon: ShoppingBagIcon,
      label: t('cart'),
      component: Cart
    },
    {
      icon: UserIcon,
      label: t('profile'),
      href: "/profile"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100 lg:hidden">
      <div className="container mx-auto px-4 flex items-center justify-between h-20 py-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const commonClasses = "flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95";

          const renderItem = (props: { className?: string; onClick?: () => void } = {}) => (
            <Button
              variant="ghost"
              size="sm"
              className={`${commonClasses} ${props.className || ''}`}
              onClick={props.onClick}
            >
              <IconComponent className="h-6 w-6 text-gray-700 group-hover:text-black group-hover:text-opacity-80 transition-colors" />
              <span className="text-[10px] text-gray-600 mt-1 font-medium tracking-tighter">
                {item.label}
              </span>
            </Button>
          );

          if (item.href) {
            return (
              <Link key={`nav-item-${index}`} href={item.href}>
                {renderItem()}
              </Link>
            );
          }

          if (item.component) {
            const Component = item.component;
            return (
              <Component key={`nav-item-${index}`}>
                {renderItem({ onClick: item.onClick })}
              </Component>
            );
          }

          return (
            <React.Fragment key={`nav-item-${index}`}>
              {renderItem({ onClick: item.onClick })}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
