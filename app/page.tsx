"use client";

import { Suspense, useState, useEffect } from 'react'
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShoppingBasket,
  Apple,
  Coffee,
  Milk,
  Egg,
  Carrot,
  CroissantIcon as Bread,
  ChevronsUpIcon as Cheese,
  Cake,
  Sandwich,
  ShoppingBag
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/header'
import { CategoryNav } from '@/components/category-nav'
import { StorySlider } from '@/components/story-slider'
import { useLanguage } from '@/lib/language-context'
import { Category } from '@/lib/types'
import { getCategories } from '@/lib/api'
import { MobileBottomMenu } from "@/components/mobile-bottom-menu"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Search } from 'lucide-react'
import { PopularProducts } from '@/components/popular-products'
import { getRandomGradient } from '@/lib/utils'
import { Typewriter } from '@/components/typewriter';
import { MdGrid3X3 } from 'react-icons/md'

// Define categoryIcons locally
const categoryIcons: Record<string, React.ReactNode> = {
  'food': <ShoppingBasket className="h-6 w-6 text-white" />,
  'drinks': <Coffee className="h-6 w-6 text-white" />,
  'fruits': <Apple className="h-6 w-6 text-white" />,
  'vegetables': <Carrot className="h-6 w-6 text-white" />,
  'dairy': <Milk className="h-6 w-6 text-white" />,
  'bakery': <Bread className="h-6 w-6 text-white" />,
  'meat': <Sandwich className="h-6 w-6 text-white" />,
  'default': <MdGrid3X3 className="h-6 w-6 text-white" />
}

function HomePageContent() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container mx-auto space-y-16 px-4 py-8">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden group">
          {/* Градиентный фон */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6b7280] to-[#4ECDC4] transition-all duration-500 group-hover:scale-[1.02]" />

          {/* Декоративный паттерн */}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay animate-slide" />

          {/* Анимированные элипсы */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Большой элипс */}
            <div className="absolute -top-20 -right-20 w-96 h-96">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent animate-float opacity-50" style={{ animationDelay: '0s' }} />
            </div>

            {/* Средний элипс */}
            <div className="absolute top-1/2 -left-12 w-64 h-64">
              <div className="w-full h-full rounded-full bg-gradient-to-tl from-white/15 to-transparent animate-float opacity-50" style={{ animationDelay: '-5s' }} />
            </div>

            {/* Маленький элипс */}
            <div className="absolute bottom-12 right-1/4 w-32 h-32">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/10 to-transparent animate-float opacity-50" style={{ animationDelay: '-10s' }} />
            </div>
          </div>

          {/* Основной контент */}
          <div className="relative z-20 flex flex-col items-center p-8 md:p-16 text-center">
            {/* Бейдж */}
            <div
              className="inline-flex items-center px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm 
                        border border-white/20 shadow-xl transform hover:scale-105 transition-all mb-8"
            >
              <Sparkles className="h-5 w-5 text-yellow-300 mr-2 animate-pulse" />
              <span className="font-medium text-sm text-white">{t('freshAndDelicious')}</span>
            </div>

            {/* Заголовок */}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-white">Оптовые поставки</span><br />{' '}
              <Typewriter
                words={[
                  'продуктов питания',
                  'хозтоваров',
                  'игрушек',
                  'бакалеи',
                  'консервов',
                  'напитков'
                ]}
                delay={100}
                className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
              />
            </h1>

            {/* Описание */}
            <p className="text-lg text-white/90 leading-relaxed max-w-xl font-light mb-8">
              {t('heroDescription')}
            </p>

            {/* Кнопки */}
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog">
                <Button size="lg"
                  className="bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl
                           transform hover:-translate-y-0.5 transition-all duration-200">
                  {t('shopNow')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile Catalog Link - Only visible on mobile */}
        <section className="lg:hidden">
          <Link href="/catalog" className="block">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{t('openCatalog')}</h3>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>
        </section>

        {/* Story Slider */}
        <section>
          <StorySlider />
        </section>

        {/* Popular Products */}
        <section>
          <PopularProducts />
        </section>

        {/* Categories Section */}
        <section>
          <div className="container p-0">
            <div className="flex items-center justify-between  mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('categories')}</h2>
              </div>
              <Link href="/catalog">
                <Button variant="ghost" className="gap-2">
                  {t('viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-[200px] rounded-2xl bg-gray-200 animate-pulse" />
                ))
              ) : categories.map((category) => {
                const [gradientFrom, gradientTo] = getRandomGradient();
                return (
                  <Link
                    key={category.id}
                    href={`/catalog?category=${category.id}`}
                    className="group relative h-[200px] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
                  >
                    {/* Gradient background */}
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                      }}
                    />

                    {/* Декоративный паттерн */}
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />

                    {/* Блики */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform -translate-x-16 -translate-y-16" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-2xl transform translate-x-16 translate-y-16" />
                    </div>

                    {/* Контент */}
                    <div className="relative h-full p-6 flex flex-col">
                      {/* Иконка */}
                      <div className="mb-auto">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm 
                                    flex items-center justify-center
                                    transform transition-transform duration-500 group-hover:scale-110">
                          {categoryIcons[category.id] || categoryIcons['default']}
                        </div>
                      </div>

                      {/* Название и описание */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                          {category.name}
                        </h3>
                        <div className="flex items-center text-white/70 text-sm">
                          <span className="transform transition-all duration-300 group-hover:translate-x-2">
                            {t('exploreCategory')}
                          </span>
                          <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-4 
                                             group-hover:opacity-100 group-hover:translate-x-0 
                                             transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <MobileBottomMenu />
    </div>
  )
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <CartProvider>
        <HomePageContent />
      </CartProvider>
    </LanguageProvider>
  )
}
