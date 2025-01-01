'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const launchTimer = setTimeout(() => setIsLaunched(true), 1000);
    const textTimer = setTimeout(() => setShowText(true), 3500);
    const hideTimer = setTimeout(() => setIsVisible(false), 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(launchTimer);
      clearTimeout(textTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const particleCount = useMemo(() => ({
    smoke: isMobile ? 15 : 50,
    flame: isMobile ? 10 : 30,
    core: isMobile ? 5 : 10,
  }), [isMobile]);

  const smokeParticles = useMemo(() => (
    Array.from({ length: particleCount.smoke }, (_, i) => ({
      id: i,
      scale: Math.random() * 0.4 + 0.5,
      delay: i * (isMobile ? 0.02 : 0.015),
      duration: Math.random() * 1.5 + (isMobile ? 1.5 : 2.5),
      x: (Math.random() - 0.5) * (isMobile ? 200 : 400),
      y: -Math.random() * (isMobile ? 250 : 500) - 200,
      opacity: Math.random() * 0.4 + 0.6,
      blur: Math.random() * (isMobile ? 2 : 4) + 2,
    }))
  ), [particleCount.smoke, isMobile]);

  const flameParticles = useMemo(() => (
    Array.from({ length: particleCount.flame }, (_, i) => ({
      id: i,
      scale: Math.random() * 0.6 + 0.6,
      delay: i * (isMobile ? 0.02 : 0.01),
      duration: Math.random() * 0.5 + (isMobile ? 0.4 : 0.7),
      y: Math.random() * (isMobile ? 100 : 150),
      x: (Math.random() - 0.5) * (isMobile ? 30 : 50),
      opacity: Math.random() * 0.5 + 0.9,
      color: i % 2 === 0 ? '#F97316' : '#FACC15',
    }))
  ), [particleCount.flame, isMobile]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[55555] flex items-center justify-center bg-gray-200 overflow-hidden"
        >
          {/* Дым */}
          <div className="absolute inset-0 overflow-hidden">
            {isLaunched && smokeParticles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute left-1/2 bottom-[10%]"
                initial={{
                  scale: particle.scale,
                  opacity: particle.opacity,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: particle.scale * (isMobile ? 8 : 16),
                  opacity: 0,
                  x: particle.x,
                  y: particle.y,
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
                style={{ willChange: 'transform' }}
              >
                <div
                  className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} bg-white rounded-full`}
                  style={{
                    filter: isMobile ? 'none' : `blur(${particle.blur}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Текст */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold text-red-500 relative z-10"
          >
            Ракета<p className="text-indigo-400">Маркет</p>
          </motion.h1>

          {/* Ракета */}
          <motion.div
            className="rocket absolute bottom-[20%]"
            animate={isLaunched ? { y: "-120vh" } : {}}
            transition={{ duration: 2.5, ease: [0.45, 0.05, 0.55, 0.95] }}
            style={{ willChange: 'transform' }}
          >
            <div className="rocket-body">
              <Image
                src="/icons/rocket.svg"
                alt="Rocket"
                width={160}
                height={320}
                className="w-[160px] h-[320px]"
                priority
              />
            </div>

            {/* Огонь */}
            {isLaunched && (
              <div className="absolute -bottom-[-130px] left-[45%] transform -translate-x-1/2">
                {flameParticles.map(particle => (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      backgroundColor: particle.color,
                      width: isMobile ? 12 : 24,
                      height: isMobile ? 12 : 24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      filter: isMobile ? 'none' : 'blur(3px)',
                    }}
                    animate={{
                      y: [0, particle.y],
                      opacity: [1, 0],
                      scale: [1, 0.4],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
