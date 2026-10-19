import { PROJECTS } from './content'

/** Every prerendered route. The first is the home page. */
export const ROUTES: string[] = ['/', ...PROJECTS.map((p) => `/work/${p.slug}`)]

export function normalizeRoute(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return ROUTES.includes(clean) ? clean : '/'
}
