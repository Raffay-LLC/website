import type { CSSProperties } from 'react'
import { PROJECTS, type Project } from '../content'

export function themeVars(p: Project): CSSProperties {
  return {
    '--card-bg': p.theme.bg,
    '--card-ink': p.theme.ink,
    '--card-mute': p.theme.mute,
    '--card-rule': p.theme.rule,
  } as CSSProperties
}

export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
