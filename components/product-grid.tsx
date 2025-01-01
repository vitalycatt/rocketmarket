"use client";

import cn from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, SortOption } from "@/lib/types";
import { fetchProducts } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/lib/cart-context";
import { ProductDrawer } from "./product-drawer";

interface ProductGridProps {
  limit?: number;
  className?: string;
  categoryId?: number;
  initialSort: SortOption;
  searchQuery?: string;
  showLoadMore?: boolean;
}

export function ProductGrid({
  limit,
  className,
  categoryId,
  initialSort,
  searchQuery = "",
  showLoadMore = true,
}: ProductGridProps) {
  const { t } = useLanguage();
  const { addToCart, removeFromCart, items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadedProductIds, setLoadedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [sort, setSort] = useState<SortOption>(initialSort);
  const loader = useRef(null);
  const currentRequestRef = useRef<number>(0);

  // Update everything when any of the filter parameters change
  useEffect(() => {
    const resetAndLoad = async () => {
      const requestId = ++currentRequestRef.current;
      setLoading(true);
      setLoadedProductIds(new Set());
      setPage(1);
      setHasMore(true);
      setSort(initialSort);

      try {
        // Check if this request is still relevant
        if (requestId !== currentRequestRef.current) return;

        const pageSize = limit || 20;
        const initialProducts = await fetchProducts(
          1,
          pageSize,
          initialSort,
          categoryId,
          searchQuery
        );

        // Check again if this request is still relevant
        if (requestId !== currentRequestRef.current) return;

        if (initialProducts.length < pageSize) {
          setHasMore(false);
        }
        setLoadedProductIds(
          new Set(initialProducts.map((product) => product.id.toString()))
        );
        setProducts(initialProducts);
        setPage(2);

        if (limit && initialProducts.length >= limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading initial products:", error);
      } finally {
        if (requestId === currentRequestRef.current) {
          setLoading(false);
        }
      }
    };

    resetAndLoad();
  }, [initialSort, categoryId, searchQuery, limit]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    if (limit && products.length >= limit) {
      setHasMore(false);
      return;
    }

    const requestId = ++currentRequestRef.current;
    setLoading(true);

    try {
      // Check if this request is still relevant
      if (requestId !== currentRequestRef.current) return;

      const remainingCount = limit ? limit - products.length : 10;
      const pageSize = Math.min(remainingCount, 10);

      const newProducts = await fetchProducts(
        page,
        pageSize,
        sort,
        categoryId,
        searchQuery
      );

      // Check again if this request is still relevant
      if (requestId !== currentRequestRef.current) return;

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        // Filter out any products we already have
        const uniqueNewProducts = newProducts.filter(
          (product) => !loadedProductIds.has(product.id.toString())
        );

        if (uniqueNewProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => {
            const combined = [...prev, ...uniqueNewProducts];
            return limit ? combined.slice(0, limit) : combined;
          });

          setLoadedProductIds((prev) => {
            const newSet = new Set(prev);
            uniqueNewProducts.forEach((product) =>
              newSet.add(product.id.toString())
            );
            return newSet;
          });

          setPage((p) => p + 1);

          if (limit && products.length + uniqueNewProducts.length >= limit) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      if (requestId === currentRequestRef.current) {
        setLoading(false);
      }
    }
  }, [
    loading,
    hasMore,
    page,
    sort,
    categoryId,
    searchQuery,
    products.length,
    limit,
    loadedProductIds,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          (!limit || products.length < limit)
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    if (loader.current && (!limit || products.length < limit)) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts, hasMore, limit, products.length, loading]);

  const handleAddToCart = (product: Product) => {
    // Ensure product_id is a valid integer
    if (!product.id || typeof product.id !== "number") {
      console.error("Invalid product: missing or invalid ID");
      return;
    }

    // Use the first size's id if available, otherwise default to 1
    const defaultSize =
      product.size && product.size.length > 0 ? product.size[0].id : 1;

    // Prepare options, ensuring each option has valid integer ids
    const defaultOptions =
      product.options && product.options.length > 0
        ? product.options
            .filter(
              (opt) =>
                opt.id !== undefined &&
                opt.values &&
                opt.values.length > 0 &&
                opt.values[0].id !== undefined
            )
            .map((opt) => ({
              option_id: Number(opt.id),
              option_value_id: Number(opt.values[0].id),
            }))
        : [{ option_id: 0, option_value_id: 0 }];

    // Validate options
    const validatedOptions = defaultOptions.map((opt) => ({
      option_id:
        Number.isInteger(opt.option_id) && opt.option_id >= 0
          ? opt.option_id
          : 0,
      option_value_id:
        Number.isInteger(opt.option_value_id) && opt.option_value_id >= 0
          ? opt.option_value_id
          : 0,
    }));

    console.log("Adding to cart:", {
      product_id: product.id,
      quantity: 1,
      size: defaultSize,
      options: validatedOptions,
    });

    addToCart(product, defaultSize, validatedOptions);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          {Array.from({ length: limit || 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-2xl h-[300px]"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t("noProductsFound")}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          {products.map((product) => {
            const defaultSize = product.size?.[0];
            const cartKey =
              product.id.toString() +
              (defaultSize?.id ? `-${defaultSize.id}` : "");
            const quantity = items[cartKey]?.quantity || 0;

            return (
              <div
                key={product.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest("button")) {
                    setSelectedProduct(product);
                  }
                }}
                className="group relative bg-white hover:bg-gray-50/80 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
              >
                {/* Product Image Container */}
                <div className="relative pt-[100%]">
                  <div className="absolute inset-0 p-3">
                    <div className="relative h-full rounded-xl overflow-hidden bg-white">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtMTRjLTMuMzEgMC02IDIuNjktNiA2czIuNjkgNiA2IDYgNi0yLjY5IDYtNi0yLjY5LTYtNi02em0wIDEwYy0yLjIxIDAtNC0xLjc5LTQtNHMxLjc5LTQgNC00IDQgMS43OSA0IDQtMS43OSA0LTQgNHoiIGZpbGw9IiNjY2MiLz48L3N2Zz4=";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="w-12 h-12 text-gray-300" />
                        </div>
                      )}

                      {/* Badges Container */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {/* Discount Badge */}
                        {Number(product.discountPercentage) > 0 && (
                          <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                            -{product.discountPercentage}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col p-3 pt-1">
                  {/* Brand & Name */}
                  <div className="mb-2 min-h-[2.5rem]">
                    {product.brand && (
                      <div className="text-xs text-gray-500 mb-0.5">
                        {product.brand}
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Cart Section */}
                  <div className="mt-auto">
                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 mb-2">
                      {defaultSize && (
                        <>
                          <div className="text-base font-semibold">
                            {(
                              defaultSize.price *
                              (1 - Number(product.discountPercentage) / 100)
                            ).toFixed(0)}{" "}
                            ₽
                          </div>
                          {Number(product.discountPercentage) > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              {defaultSize.price} ₽
                            </div>
                          )}
                        </>
                      )}
                      <div className="text-xs text-gray-500 ml-auto">
                        {product.unit}
                      </div>
                    </div>

                    {/* Cart Controls */}
                    {quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl 
                                 bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="text-sm font-medium">В корзину</span>
                      </button>
                    ) : (
                      <div className="flex items-stretch h-9 rounded-xl bg-gray-100 p-1">
                        <button
                          onClick={() => {
                            if (defaultSize?.id)
                              removeFromCart(product.id, defaultSize.id);
                          }}
                          className="w-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex-1 flex items-center justify-center text-sm font-medium min-w-[2rem]">
                          {quantity}
                        </div>
                        <button
                          onClick={() => {
                            if (defaultSize?.id) {
                              addToCart(product, defaultSize.id);
                            }
                          }}
                          className="w-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showLoadMore && hasMore && (
        <div ref={loader} className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMoreProducts()}
            disabled={loading}
          >
            {loading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
