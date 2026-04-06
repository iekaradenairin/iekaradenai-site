'use client'

import { motion } from 'framer-motion'

const BARS = 48

export function WaveformHero({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`}>
      {Array.from({ length: BARS }).map((_, i) => {
        const baseHeight = 8 + Math.abs(Math.sin(i * 0.45)) * 28 + 4
        const duration = 1.6 + (i % 9) * 0.22
        const delay = i * 0.03

        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full bg-gradient-to-t from-sky-400/50 to-cyan-200/30"
            animate={{
              scaleY: [
                1,
                0.3 + Math.abs(Math.sin(i * 0.8)) * 0.9,
                0.6 + Math.abs(Math.sin(i * 0.5)) * 0.5,
                1,
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }}
            style={{ height: `${baseHeight}px`, transformOrigin: 'bottom' }}
          />
        )
      })}
    </div>
  )
}
