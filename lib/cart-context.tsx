"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  saveCartItem,
  fetchCart,
  deleteCartItem,
  SaveCartItemRequest,
} from "@/lib/api";
import { Product } from "@/lib/types";

interface CartOption {
  name: string;
  type: string;
  description: string | number | boolean;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discountPercentage: number;
  unit: string;
  brand: string;
  size_id: number;
  size_name: string;
  options: CartOption[];
  quantity: number;
}

interface CartItems {
  [key: string]: CartItem;
}

interface CartContextType {
  items: CartItems;
  setItems: (items: CartItems) => void;
  addToCart: (
    product: Product,
    size_id: number,
    options?: Array<{ option_id: number; option_value_id: number }>
  ) => Promise<void>;
  removeFromCart: (productId: number, sizeId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItems>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cartData = await fetchCart();
        const newItems: CartItems = {};
        cartData.forEach((item) => {
          const cartKey = `${item.id}-${item.size}`;
          newItems[cartKey] = {
            id: Number(item.id),
            name: item.name,
            description: item.description,
            image: item.image || "",
            price: Number(item.price),
            discountPercentage: Number(item.discountPercentage),
            unit: item.unit,
            brand: item.brand,
            size_id: Number(item.size),
            size_name: item.size,
            options: item.options.map((opt) => ({
              name: opt,
              type: "string",
              description: opt,
            })),
            quantity: item.quantity,
          };
        });
        setItems(newItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cart");
        console.error("Error loading cart:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (
    product: Product,
    size_id: number,
    options: Array<{ option_id: number; option_value_id: number }> = []
  ) => {
    console.log(product);

    try {
      setIsLoading(true);
      setError(null);

      const selectedSize = product.size.find((size) => size.id === size_id);
      if (!selectedSize) {
        throw new Error(
          `Selected size (${size_id}) not found in product sizes`
        );
      }

      const cartKey = `${product.id}-${size_id}`;
      const currentQuantity = items[cartKey]?.quantity || 0;

      const cartItem: SaveCartItemRequest = {
        product_id: product.id,
        quantity: currentQuantity + 1,
        size: size_id,
        options: options.map((option) => ({
          option_id: option.option_id,
          option_value_id: option.option_value_id,
        })),
      };

      await saveCartItem(cartItem);

      setItems((prevItems) => ({
        ...prevItems,
        [cartKey]: {
          id: product.id,
          name: product.name,
          description: product.description || "",
          image: product.image || "",
          price: product.price || 0,
          discountPercentage: product.discountPercentage || 0,
          unit: product.unit || "",
          brand: product.brand || "",
          size_id,
          size_name: selectedSize.size,
          quantity: currentQuantity + 1,
          options: options.map((opt) => ({
            name: String(opt.option_id),
            type: "number",
            description: String(opt.option_value_id),
          })),
        },
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add item to cart"
      );
      console.error("Error in addToCart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = useCallback(
    async (productId: number, cartId: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const cartKey = `${productId}-${cartId}`;
        const item = items[cartKey];

        if (!item) {
          throw new Error("Item not found in cart");
        }

        await deleteCartItem({
          cart_id: cartId,
          product_id: productId,
        });

        setItems((prevItems) => {
          const newItems = { ...prevItems };
          delete newItems[cartKey];
          return newItems;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove item from cart"
        );
        console.error("Error in removeFromCart:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [items]
  );

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Remove each item from the cart one by one
      await Promise.all(
        Object.entries(items).map(([_, item]) =>
          deleteCartItem({
            product_id: item.id,
            size: item.size_id,
            quantity: item.quantity,
            options: item.options.map((opt) => ({
              option_id: Number(opt.name),
              option_value_id: Number(opt.description),
            })),
          })
        )
      );

      setItems({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
      console.error("Error in clearCart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const getCartCount = useCallback(() => {
    return Object.values(items).reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        error,
        setItems,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
