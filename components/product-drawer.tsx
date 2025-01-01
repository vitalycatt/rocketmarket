'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus, X, Truck, Package } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductDrawerProps {
  product: Product | null
  onClose: () => void
}

export function ProductDrawer({ product, onClose }: ProductDrawerProps) {
  const { items, addToCart, removeFromCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.size?.[0]?.size
  )

  const handleAddToCart = () => {
    if (!product) return;

    // Ensure product_id is a valid integer
    if (!product.id || typeof product.id !== 'number') {
      console.error('Invalid product: missing or invalid ID');
      return;
    }

    // Determine size, ensuring it's a positive integer
    const sizeToUse = selectedSize 
      ? product.size.find(s => s.size === selectedSize)?.id ?? 1
      : (product.size && product.size.length > 0 
          ? product.size[0].id
          : 1);

    // Validate size is a positive integer
    if (sizeToUse < 1 || !Number.isInteger(sizeToUse)) {
      console.error('Invalid size:', sizeToUse);
      return;
    }

    // Prepare options
    const defaultOptions = product.options && product.options.length > 0
      ? product.options.map(opt => {
          const firstDesc = opt.description && opt.description.length > 0 
            ? opt.description[0] 
            : { id: 0 };
          return {
            option_id: Number(opt.id),
            option_value_id: Number(firstDesc.id)
          };
        })
      : [{ option_id: 0, option_value_id: 0 }];

    console.log('Adding to cart:', {
      product_id: product.id,
      quantity: 1,
      size_id: sizeToUse,
      options: defaultOptions
    });

    addToCart(product, sizeToUse, defaultOptions);
  };

  if (!product) return null

  const cartKey = product.id.toString() + (selectedSize ? `-${selectedSize}` : '')
  const quantity = items[cartKey]?.quantity || 0
  const selectedSizeObj = product.size?.find(s => s.size === selectedSize)
  const price = selectedSizeObj?.price || 0
  const discountedPrice = price * (1 - Number(product.discountPercentage) / 100)

  return (
    <Sheet open={!!product} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="h-[85vh] p-0 sm:max-w-md mx-auto rounded-t-[2.5rem] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col h-full bg-white"
        >
          {/* Header */}
          <div className="sticky top-0 z-50 flex flex-col items-center bg-white pt-4">
            <div className="w-8 h-1 bg-gray-200 rounded-full mb-4" />
            <button
              onClick={onClose}
              className="absolute right-6 top-3 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-6 pb-6 space-y-6">
              {/* Image and Basic Info */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 group">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1.5 rounded-full bg-red-500/95 text-white text-sm font-medium 
                                 shadow-lg shadow-red-500/20 backdrop-blur-sm"
                      >
                        -{product.discountPercentage}%
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {product.brand && (
                    <div className="text-sm font-medium text-gray-500">{product.brand}</div>
                  )}
                  <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
                  {product.description && (
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  )}
                </div>
              </div>

              {/* Sizes */}
              {product.size && product.size.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Размер</h3>
                    <span className="text-sm text-gray-500">{product.unit}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.size.map((size) => (
                      <motion.button
                        key={size.size}
                        onClick={() => setSelectedSize(size.size)}
                        whileTap={{ scale: 0.97 }}
                        className={`relative py-3 rounded-xl text-sm font-medium transition-all duration-200
                          ${
                            selectedSize === size.size
                              ? 'bg-gray-900 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }
                        `}
                      >
                        {size.size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Способ получения</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <Truck className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Доставка</div>
                      <div className="text-xs text-gray-500">1-2 дня</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Самовывоз</div>
                      <div className="text-xs text-gray-500">Сегодня</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Bottom Panel */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100">
            <div className="p-5 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {discountedPrice.toFixed(0)} ₽
                  </div>
                  {product.discountPercentage > 0 && (
                    <div className="text-sm text-gray-400 line-through mt-0.5">
                      {price} ₽
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Controls */}
              {quantity === 0 ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center p-4 rounded-xl
                           bg-gray-900 text-white font-medium
                           transition-all duration-200 hover:bg-gray-800"
                  disabled={!product.size || product.size.length === 0}
                >
                  {!product.size || product.size.length === 0 ? 'Нет в наличии' : 'В корзину'}
                </motion.button>
              ) : (
                <div className="flex items-stretch h-[52px] rounded-xl bg-gray-100">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectedSize && removeFromCart(Number(product.id), Number(selectedSize))}
                    className="w-[52px] flex items-center justify-center rounded-l-xl hover:bg-white transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>
                  <div className="flex-1 flex items-center justify-center text-lg font-medium">
                    {quantity}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className="w-[52px] flex items-center justify-center rounded-r-xl hover:bg-white transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
