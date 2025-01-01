import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Category } from "@/lib/types";
import { getCategories } from "@/lib/api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MdGrid3X3 } from "react-icons/md";

interface CategoryNavProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory?: string;
  className?: string;
  isMobile?: boolean;
}

export function CategoryNav({
  isMobile = false,
  className,
  onCategorySelect,
  selectedCategory = "all",
}: CategoryNavProps) {
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const findCategoryById = (id: string): Category | null => {
    const findInCategories = (categories: Category[]): Category | null => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.children.length > 0) {
          const found = findInCategories(category.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInCategories(categories);
  };

  const findParentCategory = (childId: string): Category | null => {
    const findInCategories = (categories: Category[]): Category | null => {
      for (const category of categories) {
        if (category.children.some((child) => child.id === childId))
          return category;
        for (const child of category.children) {
          const found = findInCategories([child]);
          if (found) return found;
        }
      }
      return null;
    };
    return findInCategories(categories);
  };

  const handleMobileCategorySelect = (category: Category) => {
    const hasChildren = category.children.length > 0;
    if (hasChildren) {
      setCurrentCategory(category.id);
      setBreadcrumbs((prev) => [...prev, category]);
    }
    onCategorySelect(category.id);
  };

  const handleMobileBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = [...breadcrumbs];
      newBreadcrumbs.pop();
      const parentCategory = newBreadcrumbs[newBreadcrumbs.length - 1];
      setBreadcrumbs(newBreadcrumbs);
      setCurrentCategory(parentCategory.id);
      onCategorySelect(parentCategory.id);
    } else {
      setCurrentCategory(null);
      setBreadcrumbs([]);
      onCategorySelect("all");
    }
  };

  useEffect(() => {
    if (selectedCategory !== "all" && categories.length > 0) {
      const category = findCategoryById(selectedCategory);

      if (category) {
        // Collect all parent categories
        const getBreadcrumbs = (categoryId: string): Category[] => {
          const breadcrumbs: Category[] = [];
          let currentId = categoryId;
          let currentCategory = findCategoryById(currentId);

          while (currentCategory) {
            breadcrumbs.unshift(currentCategory);
            const parentCategory = findParentCategory(currentCategory.id);
            if (!parentCategory) break;
            currentCategory = parentCategory;
          }

          return breadcrumbs;
        };

        const newBreadcrumbs = getBreadcrumbs(selectedCategory);
        setBreadcrumbs(newBreadcrumbs);
        setCurrentCategory(category.id);

        // Expand all parent categories
        const newExpanded = new Set<string>();
        newBreadcrumbs.forEach((cat) => {
          const parent = findParentCategory(cat.id);
          if (parent) {
            newExpanded.add(parent.id);
          }
        });
        setExpandedCategories(newExpanded);
      }
    } else if (selectedCategory === "all") {
      setBreadcrumbs([]);
      setCurrentCategory(null);
      setExpandedCategories(new Set());
    }
  }, [selectedCategory, categories]);

  const renderCategories = (categories: Category[], level = 0) => {
    if (!categories) return null;

    return categories.map((category) => {
      const isExpanded = expandedCategories.has(category.id);
      const hasChildren = category.children.length > 0;
      const isSelected = selectedCategory === category.id;

      return (
        <div
          key={category.id}
          className={cn("category-item", { "pl-4": level > 0 })}
          onClick={() => console.log("CATEGORY ITEM")}
        >
          <div
            className={cn(
              "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-accent transition-colors",
              isSelected && "bg-accent"
            )}
            onClick={() => {
              if (isMobile) {
                handleMobileCategorySelect(category);
              } else {
                onCategorySelect(category.id);
                if (hasChildren) {
                  toggleCategory(category.id);
                }
              }
            }}
          >
            <div className="relative w-5 h-5">
              {category.iconUrl ? (
                <Image
                  src={category.iconUrl}
                  alt={category.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Use type assertion to access src property
                    const img = e.target as HTMLImageElement;
                    if (img.src !== "/icons/categories/default.svg") {
                      img.src = "/icons/categories/default.svg";
                    }
                  }}
                />
              ) : (
                <Image
                  src="/icons/categories/default.svg"
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <span className="flex-1">{category.name}</span>
            {hasChildren && !isMobile && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "transform rotate-90"
                )}
              />
            )}
            {hasChildren && isMobile && <ChevronRight className="h-4 w-4" />}
          </div>
          {!isMobile && isExpanded && hasChildren && (
            <div className="children">
              {renderCategories(category.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (isMobile) {
    return (
      <div className={cn("category-nav mobile", className)}>
        <div className="mobile-header">
          {currentCategory ? (
            <button
              onClick={handleMobileBack}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              {breadcrumbs.length > 0
                ? breadcrumbs[breadcrumbs.length - 1].name
                : t("allCategories")}
            </button>
          ) : (
            <span className="text-sm font-medium">{t("categories")}</span>
          )}
        </div>
        <ScrollArea className="mobile-categories">
          {currentCategory === null
            ? renderCategories(categories)
            : renderCategories(
                breadcrumbs.length > 0
                  ? breadcrumbs[breadcrumbs.length - 1].children
                  : categories
              )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className={cn("category-nav desktop", className)}>
      <button
        onClick={() => onCategorySelect("all")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          selectedCategory === "all"
            ? "bg-primary text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <MdGrid3X3 className="h-5 w-5" />
        {t("allCategories")}
      </button>
      {renderCategories(categories)}
    </div>
  );
}
