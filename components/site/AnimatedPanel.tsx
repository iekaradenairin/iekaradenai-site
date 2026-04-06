'use client'

import { motion } from 'framer-motion'

export function AnimatedPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 10px 24px rgba(148,163,184,0.10)',
          '0 18px 34px rgba(148,163,184,0.14)',
          '0 10px 24px rgba(148,163,184,0.10)',
        ],
      }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
