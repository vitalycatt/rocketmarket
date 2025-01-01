'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/product-grid'
import { useLanguage } from '@/lib/language-context'
import { SortOption } from '@/lib/types'

export function PopularProducts() {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('popularProducts')}</h2>
        <Link href="/catalog">
          <Button variant="ghost" className="gap-2">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <ProductGrid
        initialSort={SortOption.popular}
        limit={8}
        showLoadMore={false}
        className="pb-4"
      />
    </div>
  )
}
