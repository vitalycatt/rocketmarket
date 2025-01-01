"use client";

import React, { PropsWithChildren, useState, useCallback } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

interface CartProps extends PropsWithChildren {
  // Add any additional props if needed
}

export function Cart({ children }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useLanguage();
  const router = useRouter();
  const { items, removeFromCart, clearCart, getCartCount, isLoading, error } =
    useCart();

  const getItemPrice = useCallback((item: (typeof items)[string]) => {
    const basePrice = item.price || 0;
    const discount = item.discountPercentage || 0;
    return basePrice * (1 - discount / 100);
  }, []);

  const getTotalPrice = useCallback(() => {
    return Object.values(items).reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  }, [items, getItemPrice]);

  const handleRemoveItem = async (productId: number, sizeId: number) => {
    try {
      await removeFromCart(productId, sizeId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false); // Close the cart drawer
    router.push("/checkout"); // Navigate to checkout page
  };

  const cartItems = Object.entries(items).map(([key, item]) => {
    const [productId, sizeId] = key.split("-").map(Number);

    return {
      key,
      product: item,
      totalPrice: getItemPrice(item) * item.quantity,
      pricePerItem: getItemPrice(item),
      productId,
      sizeId,
    };
  });

  console.log(cartItems, "CART ITEM");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className="relative md:flex hidden group transition-all hover:bg-gray-500/20"
          >
            <ShoppingCart className="h-5 w-5 group-hover:text-black" />
            {!isLoading && getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {getCartCount()}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="mb-4">
          <SheetTitle>{t("cartpg.title")}</SheetTitle>
        </SheetHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems && cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <ShoppingCart className="h-12 w-12 mb-2" />
            <p>{t("cartpg.empty")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setIsOpen(false);
                router.push("/catalog");
              }}
            >
              {t("cartpg.continueShopping")}
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map(
                  ({
                    key,
                    product,
                    totalPrice,
                    pricePerItem,
                    productId,
                    sizeId,
                  }) => {
                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="relative h-20 w-20 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {typeof product.size_name === "string"
                              ? product.size_name
                              : product.size_name.size}{" "}
                            {product.unit}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {pricePerItem.toFixed(2)} ₽
                            </p>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-red-600 font-medium">
                                -{product.discountPercentage}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {totalPrice.toFixed(2)} ₽
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveItem(productId, sizeId)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">
                              {t("cartpg.quantity")}: {product.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </ScrollArea>

            <div className="mt-6 space-y-4">
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-base font-medium">
                  {t("cartpg.total")}:
                </span>
                <span className="text-lg font-bold">
                  {getTotalPrice().toFixed(2)} ₽
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isLoading}
                >
                  {t("cartpg.clear")}
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {t("cartpg.checkout")}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
