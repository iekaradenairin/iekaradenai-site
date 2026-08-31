'use client'

import { motion } from 'framer-motion'
import { GlassOrb } from './GlassOrb'

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#122430_0%,#0D1920_100%)] text-shinkai-200">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,168,199,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(95,168,199,0.10),transparent_30%),radial-gradient(circle_at_40%_18%,rgba(95,168,199,0.08),transparent_14%)]"
          animate={{ opacity: [0.78, 1, 0.82] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <GlassOrb className="left-[-120px] top-[-40px] h-72 w-72 bg-gradient-to-br from-sheen/25 via-shinkai-400/15 to-transparent" delay={0.2} />
        <GlassOrb className="right-[-80px] top-10 h-96 w-96 bg-gradient-to-br from-sheen/20 via-shinkai-400/12 to-transparent" delay={1.2} />
      </div>
      {children}
    </div>
  )
}
