"use client"

import { useEffect, useState, useRef } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface StoryModalProps {
  stories: Story[]
  initialStoryIndex: number
  isOpen: boolean
  onClose: () => void
  onStoryComplete: (storyId: number) => void
  onStoryAction: () => void
}

export function StoryModal({
  stories,
  initialStoryIndex,
  isOpen,
  onClose,
  onStoryComplete,
  onStoryAction
}: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)
  const progressInterval = useRef<NodeJS.Timeout>()
  const currentStory = stories[currentIndex]
  const storyDuration = 5000 // 5 seconds per story

  useEffect(() => {
    setCurrentIndex(initialStoryIndex)
    setIsAnimating(true)
  }, [initialStoryIndex])

  useEffect(() => {
    if (!isOpen || isPaused) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / storyDuration) * 100

      if (newProgress >= 100) {
        clearInterval(timer)
        setIsAnimating(false)
        onStoryComplete(currentStory.id)
        
        setTimeout(() => {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setProgress(0)
            setIsAnimating(true)
          } else {
            onClose()
          }
        }, 200)
      } else {
        setProgress(newProgress)
      }
    }, 16) // Более плавная анимация с частотой 60fps

    return () => clearInterval(timer)
  }, [currentIndex, isOpen, isPaused, currentStory.id, stories.length, onClose, onStoryComplete])

  // Управляем theme-color при открытии/закрытии модального окна
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (isOpen) {
      metaThemeColor?.setAttribute('content', '#000000')
    } else {
      metaThemeColor?.setAttribute('content', '#f3f4f6')
    }
    
    return () => {
      metaThemeColor?.setAttribute('content', '#f3f4f6')
    }
  }, [isOpen])

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setIsAnimating(false)
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
        setProgress(0)
        setIsAnimating(true)
      }, 200)
    }
  }

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setIsAnimating(false)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setProgress(0)
        setIsAnimating(true)
      }, 200)
    } else {
      onClose()
    }
  }

  const handleClickButton = () => {
    const currentStory = stories[currentIndex]
    if (currentStory.content?.buttonLink) {
      onStoryAction()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {/* Close button */}
      <button
        onClick={() => onClose()}
        className="absolute top-6 right-6 text-white/80 hover:text-white z-50 p-2 
                   backdrop-blur-sm bg-black/20 rounded-full transition-all duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Progress bars */}
      <div className="absolute top-6 left-6 right-14 flex gap-1.5 z-50">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="h-[3px] bg-white/20 flex-1 rounded-full overflow-hidden"
          >
            <div
              className={cn(
                "h-full bg-white rounded-full transition-all",
                index === currentIndex && isAnimating
                  ? "w-[" + progress + "%] duration-[16ms] ease-linear"
                  : index < currentIndex
                  ? "w-full duration-200 ease-out"
                  : "w-0 duration-200 ease-out"
              )}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-0 top-0 w-1/3 h-full z-40"
        onClick={handlePrevStory}
      />
      <button
        className="absolute right-0 top-0 w-1/3 h-full z-40"
        onClick={handleNextStory}
      />

      {/* Story content */}
      <div 
        className={cn(
          "relative w-full h-[calc(100vh-env(safe-area-inset-bottom))] md:w-[420px] md:h-[85vh]",
          "bg-center bg-cover transition-all duration-300 ease-out",
          isAnimating ? "opacity-100 scale-100" : "opacity-95 scale-[0.98]"
        )}
        style={{ 
          backgroundImage: `url(${currentStory.image})`,
          transform: isPaused ? 'scale(0.98)' : 'scale(1)'
        }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Градиентная подложка для контента */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
        
        {currentStory.content && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white",
            "transition-all duration-300 ease-out transform",
            isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h3 className="text-2xl font-bold mb-3 drop-shadow">
              {currentStory.content.title}
            </h3>
            <p className="mb-6 text-white/90 leading-relaxed text-lg">
              {currentStory.content.description}
            </p>
            {currentStory.content.buttonText && currentStory.content.buttonLink && (
              <button
                onClick={handleClickButton}
                className="inline-flex items-center px-8 py-4 bg-white/95 backdrop-blur-sm text-black 
                         rounded-2xl font-medium text-lg hover:bg-white transition-all duration-200"
              >
                {currentStory.content.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
