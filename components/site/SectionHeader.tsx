'use client'

import { motion } from 'framer-motion'

export function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="mb-5"
    >
      <p className="text-sm font-medium text-sky-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-[2rem]">
        {title}
      </h2>
      {body ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{body}</p> : null}
    </motion.div>
  )
}
