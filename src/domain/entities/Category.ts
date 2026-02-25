import type { CategoryColor } from '../value-objects/CategoryColor'

export interface Category {
  readonly id: string
  readonly name: string
  readonly color: CategoryColor
}

export const DEFAULT_CATEGORY_COLORS: CategoryColor[] = [
  { primary: '#7eb8ff', gradient: 'linear-gradient(90deg, #7eb8ff, #3b82f6)', border: 'rgba(126,184,255,0.2)' },
  { primary: '#00e5a0', gradient: 'linear-gradient(90deg, #00e5a0, #00b8d9)', border: 'rgba(0,229,160,0.2)' },
  { primary: '#ff6b6b', gradient: 'linear-gradient(90deg, #ff6b6b, #ff9a9a)', border: 'rgba(255,107,107,0.2)' },
  { primary: '#ffd166', gradient: 'linear-gradient(90deg, #ffd166, #ffaa00)', border: 'rgba(255,209,102,0.2)' },
  { primary: '#c084fc', gradient: 'linear-gradient(90deg, #c084fc, #a855f7)', border: 'rgba(192,132,252,0.2)' },
  { primary: '#fb923c', gradient: 'linear-gradient(90deg, #fb923c, #f97316)', border: 'rgba(251,146,60,0.2)' },
  { primary: '#67e8f9', gradient: 'linear-gradient(90deg, #67e8f9, #22d3ee)', border: 'rgba(103,232,249,0.2)' },
  { primary: '#86efac', gradient: 'linear-gradient(90deg, #86efac, #4ade80)', border: 'rgba(134,239,172,0.2)' },
]
