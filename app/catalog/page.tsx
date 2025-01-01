"use client";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Cart } from "@/components/cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortOption } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-grid";
import { AddressDrawer } from "@/components/address-drawer";
import { useSearchParams } from "next/navigation";
import { MobileBottomMenu } from "@/components/mobile-bottom-menu";
import { CategoriesDrawer } from "@/components/categories-drawer";
import { ProfileMenu, AddressBar } from "@/components/header";
import { useEffect, useRef, useState, Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  LayoutGrid,
  ChevronRight,
  ArrowUpDown,
  ArrowDownUp,
  Clock,
  Star,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";

import "@/styles/category-nav.css";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const { t } = useLanguage();
  const lastScrollY = useRef(0);
  const searchParams = useSearchParams();

  const [sortOption, setSortOption] = useState<SortOption>(SortOption.popular);
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") ?? ""
  );
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "all"
  );
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  const sortOptions = [
    {
      value: SortOption.popular,
      label: "Popular",
      icon: <Star className="h-5 w-5" />,
    },
    {
      value: SortOption.priceAsc,
      label: "Price: Low to High",
      icon: <ArrowDownUp className="h-5 w-5" />,
    },
    {
      value: SortOption.priceDesc,
      label: "Price: High to Low",
      icon: <ArrowUpDown className="h-5 w-5" />,
    },
    {
      value: SortOption.newest,
      label: "Newest",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: SortOption.oldest,
      label: "Oldest",
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search");
      if (search) {
        setSearchQuery(search);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams) {
      const category = searchParams.get("category");
      if (category) {
        setSelectedCategory(category);
      }

      const sort = searchParams.get("sort") as SortOption;
      if (sort && sortOptions.some((option) => option.value === sort)) {
        setSortOption(sort);
      }
    }
  }, [searchParams]);

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
  };

  const handleCategorySelect = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Изменяем условие для более плавного появления
      const scrollingUp =
        currentScrollY <= lastScrollY.current || currentScrollY < 50;
      setIsScrollingUp(scrollingUp);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <AddressBar setIsAddressDrawerOpen={setIsAddressDrawerOpen} />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="hidden md:block">
              <Logo />
            </div>
            <div className="flex-1 mx-4">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-all duration-200" />
                <Input
                  type="search"
                  placeholder={t("searchProducts")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <ProfileMenu />
              </div>
              <div className="hidden md:block">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative p-2 hover:bg-primary/5 active:scale-95 transition-all duration-200"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "flex items-center gap-2 transition-colors duration-200",
                        sortOption === option.value &&
                          "bg-primary/5 text-primary"
                      )}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Categories */}
      <div
        className={cn(
          "lg:hidden sticky z-40 bg-white border-b",
          "transition-all duration-300 ease-in-out transform",
          isScrollingUp
            ? "top-[110px] translate-y-0 opacity-100 shadow-sm"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "px-4 py-2 transition-all duration-300 ease-in-out transform",
            isScrollingUp
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          )}
        >
          <CategoriesDrawer
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-full flex items-center justify-between p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-gray-500" />
                <span>{t("categories")}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          </CategoriesDrawer>
        </div>
      </div>

      {/* Address Drawer */}
      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        onSave={(addressData) => {
          console.log("New address:", addressData);
          setIsAddressDrawerOpen(false);
        }}
      />

      <div className="lg:container mx-auto lg:px-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Desktop Categories */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CategoryNav
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 px-2 xs:px-3 sm:px-4 lg:px-0 pt-3 sm:pt-4 lg:pt-0">
            <ProductGrid
              initialSort={sortOption}
              categoryId={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Menu */}
      <MobileBottomMenu />
    </div>
  );
}
