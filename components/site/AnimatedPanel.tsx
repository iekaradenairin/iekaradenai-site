import { cn } from '@/lib/utils'

export function AnimatedPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]', className)}>
      {children}
    </div>
  )
}
