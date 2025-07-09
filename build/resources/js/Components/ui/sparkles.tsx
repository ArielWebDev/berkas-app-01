import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  particleSize?: number;
}

export const SparklesCore = ({
  className,
  background = 'transparent',
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 120,
  particleColor = '#FFF',
  particleSize = 1.2,
}: SparklesCoreProps) => {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: particleDensity }, (_, i) => ({
        id: `sparkle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [maxSize, minSize, particleDensity]);

  return (
    <div className={cn('relative h-full w-full', className)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        style={{ background }}
      >
        {sparkles.map(sparkle => (
          <motion.circle
            key={sparkle.id}
            cx={sparkle.x}
            cy={sparkle.y}
            r={sparkle.size * particleSize}
            fill={particleColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
};
