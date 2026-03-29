import { type Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.08, ease: 'easeOut' as const },
  }),
}
