"use client"

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { StoryModal } from './story-modal'

interface Story {
  id: number
  title: string
  image: string
  category: string
  content?: {
    title: string
    description: string
    buttonText?: string
    buttonLink?: string
  }
}

export const stories: Story[] = [
  {
    id: 1,
    title: 'Новинки',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650',
    category: 'new',
    content: {
      title: 'Свежие поступления',
      description: 'Новые продукты и деликатесы уже в нашем магазине. Попробуйте первыми!',
      buttonText: 'Смотреть новинки',
      buttonLink: '/catalog?category=new'
    }
  },
  {
    id: 2,
    title: 'Акции',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca',
    category: 'sale',
    content: {
      title: 'Выгодные предложения',
      description: 'Скидки до 50% на популярные товары. Экономьте с нами каждый день!',
      buttonText: 'К акциям',
      buttonLink: '/catalog?category=sale'
    }
  },
  {
    id: 3,
    title: 'Фрукты',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    category: 'fruits',
    content: {
      title: 'Сезон свежих фруктов',
      description: 'Сочные и спелые фрукты по выгодным ценам. Витамины для всей семьи!',
      buttonText: 'Выбрать фрукты',
      buttonLink: '/catalog?category=fruits'
    }
  },
  {
    id: 4,
    title: 'Готовим дома',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
    category: 'cooking',
    content: {
      title: 'Все для домашней кухни',
      description: 'Продукты и ингредиенты для ваших любимых блюд. Готовьте с удовольствием!',
      buttonText: 'К продуктам',
      buttonLink: '/catalog?category=cooking'
    }
  }
]

export function StorySlider() {
  const router = useRouter()
  const [viewedStories, setViewedStories] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  // Загружаем просмотренные истории из localStorage при монтировании
  useEffect(() => {
    const viewed = localStorage.getItem('viewedStories')
    if (viewed) {
      setViewedStories(JSON.parse(viewed))
    }
  }, [])

  const handleStoryClick = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex)
    setIsModalOpen(true)
  }

  const handleStoryComplete = (storyId: number) => {
    // Отмечаем историю как просмотренную
    if (!viewedStories.includes(storyId)) {
      const newViewedStories = [...viewedStories, storyId]
      setViewedStories(newViewedStories)
      localStorage.setItem('viewedStories', JSON.stringify(newViewedStories))
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleStoryAction = () => {
    // Переходим по ссылке только при явном клике на кнопку действия
    const currentStory = stories[currentStoryIndex]
    if (currentStory.content?.buttonLink) {
      router.push(currentStory.content.buttonLink)
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="relative px-4 py-8">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {stories.map((story, index) => {
            const isViewed = viewedStories.includes(story.id)
            return (
              <button
                key={story.id}
                onClick={() => handleStoryClick(index)}
                className="flex-shrink-0 w-32 text-center focus:outline-none group"
              >
                <div
                  className={cn(
                    "w-32 h-48 rounded-2xl overflow-hidden mb-3 relative",
                    "bg-gradient-to-b from-gray-900/10 to-gray-900/60",
                    isViewed 
                      ? "ring-1 ring-gray-200" 
                      : "ring-2 ring-primary",
                    "group-hover:ring-2 group-hover:ring-primary transition-all duration-300"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={128}
                    height={192}
                    className="w-full h-full object-cover scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <span className="text-sm font-medium text-white line-clamp-2 text-left">
                      {story.title}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <StoryModal
        stories={stories}
        initialStoryIndex={currentStoryIndex}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStoryComplete={handleStoryComplete}
        onStoryAction={handleStoryAction}
      />
    </>
  )
}
