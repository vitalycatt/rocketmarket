import { useState, useEffect } from 'react'
import { Package, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { Category } from '@/lib/types'
import { getCategories } from '@/lib/api'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

interface CategoriesDrawerProps {
  onCategorySelect: (categoryId: string) => void
  selectedCategory?: string
  children?: React.ReactNode
}

export function CategoriesDrawer({ onCategorySelect, selectedCategory = 'all', children }: CategoriesDrawerProps) {
  const { t } = useLanguage()
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
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

  const handleCategorySelect = (category: Category) => {
    const hasChildren = category.children.length > 0;
    if (hasChildren) {
      setCurrentCategory(category.id)
      const fullCategory = findCategoryById(category.id)
      if (fullCategory) {
        setBreadcrumbs(prev => [...prev, fullCategory])
      }
    }
    onCategorySelect(category.id)
  }

  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = [...breadcrumbs]
      newBreadcrumbs.pop()
      const parentCategory = newBreadcrumbs[newBreadcrumbs.length - 1]
      setBreadcrumbs(newBreadcrumbs)
      setCurrentCategory(parentCategory.id)
      onCategorySelect(parentCategory.id)
    } else {
      setCurrentCategory(null)
      setBreadcrumbs([])
      onCategorySelect('all')
    }
  }

  const findCategoryById = (id: string) => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      for (const child of cat.children) {
        if (child.id === id) return child;
        // Search in deeper levels if needed
        for (const grandchild of child.children) {
          if (grandchild.id === id) return grandchild;
        }
      }
    }
    return null;
  };

  const findChildCategories = (parentId: string) => {
    const parent = findCategoryById(parentId);
    return parent ? parent.children : [];
  };

  const currentCategories = currentCategory
    ? findChildCategories(currentCategory)
    : [{ id: 'all', name: t('allCategories'), position: '0', iconUrl: '', children: [] }, ...categories];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 border-r shadow-2xl">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              className="flex flex-col h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {/* Header */}
              <motion.div
                className="p-6 border-b"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <SheetTitle className="text-xl mb-4">{t('categories')}</SheetTitle>

                {/* Breadcrumbs */}
                <AnimatePresence mode="wait">
                  {breadcrumbs.length > 0 && (
                    <motion.div
                      className="flex flex-wrap items-center gap-1 text-sm"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => {
                          setCurrentCategory(null)
                          setBreadcrumbs([])
                          onCategorySelect('all')
                        }}
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        {t('allCategories')}
                      </button>
                      {breadcrumbs.map((crumb, index) => (
                        <motion.div
                          key={crumb.id}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                          <button
                            onClick={() => {
                              const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
                              setBreadcrumbs(newBreadcrumbs)
                              setCurrentCategory(crumb.id)
                              onCategorySelect(crumb.id)
                            }}
                            className={cn(
                              "hover:text-primary transition-colors",
                              index === breadcrumbs.length - 1 ? "text-primary font-medium" : "text-gray-600"
                            )}
                          >
                            {crumb.name}
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Back button */}
              <AnimatePresence>
                {breadcrumbs.length > 0 && (
                  <motion.button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-all border-b"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('back')}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Categories List */}
              <ScrollArea className="flex-1 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCategory || 'root'}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentCategories.map((category, index) => {
                      const hasChildren = category.children.length > 0
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                            selectedCategory === category.id
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-gray-50 active:bg-gray-100"
                          )}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Package className={cn(
                            "h-5 w-5 flex-shrink-0",
                            selectedCategory === category.id ? "text-primary" : "text-gray-400"
                          )} />
                          <div className="flex-1 text-left">
                            <div className="font-medium">
                              {category.name}
                            </div>

                          </div>
                          {hasChildren && (
                            <ChevronRight className={cn(
                              "h-4 w-4",
                              selectedCategory === category.id ? "text-primary" : "text-gray-400"
                            )} />
                          )}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
                <ScrollBar />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
