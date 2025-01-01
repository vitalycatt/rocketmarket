'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'mobile'
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  if (variant === 'mobile') {
    return (
      <Link href="/" className={cn("flex items-center space-x-2", className)}>
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg">
          <span className="font-bold text-xl">RM</span>
        </div>
        <span className="font-bold text-sm text-gray-800 max-lg:hidden">
          Rocket <br /> Market
        </span>
      </Link>
    )
  }

  return (
    <Link href="/" className={cn("flex items-center space-x-3", className)}>
      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg">
        <span className="font-bold text-2xl">RM</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-gray-900">Rocket Market</span>
        <span className="text-xs text-gray-500">Fresh & Delicious</span>
      </div>
    </Link>
  )
}
