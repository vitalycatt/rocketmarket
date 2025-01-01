"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'new',
    content: {
      title: 'Новая коллекция',
      description: 'Откройте для себя нашу новую коллекцию товаров. Свежие идеи и тренды этого сезона.',
      buttonText: 'Смотреть новинки',
      buttonLink: '/?category=new'
    }
  },
  {
    id: 2,
    title: 'Акции',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3',
    category: 'sale',
    content: {
      title: 'Специальные предложения',
      description: 'Успейте купить товары со скидкой до 50%. Предложение ограничено!',
      buttonText: 'К акциям',
      buttonLink: '/?category=sale'
    }
  },
  {
    id: 3,
    title: 'Популярное',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    category: 'popular',
    content: {
      title: 'Хиты продаж',
      description: 'Самые популярные товары по мнению наших покупателей',
      buttonText: 'Смотреть популярное',
      buttonLink: '/?category=popular'
    }
  },
  {
    id: 4,
    title: 'Подарки',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48',
    category: 'gifts',
    content: {
      title: 'Идеи подарков',
      description: 'Выберите идеальный подарок для своих близких',
      buttonText: 'Выбрать подарок',
      buttonLink: '/?category=gifts'
    }
  }
]

interface StoriesProps {
  onCategorySelect?: (category: string) => void
}

export function Stories({ onCategorySelect }: StoriesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
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
    
    // Обновляем категорию и URL только если пользователь кликнул на кнопку в истории
    const currentStory = stories[currentStoryIndex]
    if (currentStory.content?.buttonLink && onCategorySelect) {
      onCategorySelect(currentStory.category)

      // Обновляем URL с новой категорией только если была нажата кнопка
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('category', currentStory.category)
        router.push(`?${params.toString()}`)
      }
    }
  }

  return (
    <>
      <div className="px-4 mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4">
          {stories.map((story, index) => {
            const isViewed = viewedStories.includes(story.id)
            return (
              <button
                key={story.id}
                onClick={() => handleStoryClick(index)}
                className="flex-shrink-0 w-20 text-center focus:outline-none"
              >
                <div 
                  className={cn(
                    "w-20 h-20 rounded-full overflow-hidden mb-2",
                    "ring-2 transition-all duration-200",
                    isViewed ? "ring-gray-200" : "ring-primary"
                  )}
                >
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600">{story.title}</span>
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
        onStoryAction={handleModalClose}
      />
    </>
  )
}
