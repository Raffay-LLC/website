import type { Clip } from './content'

/** Real screen recordings, copied from the Tiercel site. */
export const CLIPS: Record<string, Clip> = {
  'finly-voice': {
    id: 'finly-voice',
    mp4: '/media/finly-voice.mp4',
    webm: '/media/finly-voice.webm',
    poster: '/media/finly-voice.jpg',
    alt: 'Finly voice entry on iPhone: a spoken purchase becomes two draft transactions, confirmed together.',
  },
  'finly-categories': {
    id: 'finly-categories',
    mp4: '/media/finly-categories.mp4',
    webm: '/media/finly-categories.webm',
    poster: '/media/finly-categories.jpg',
    alt: 'Finly monthly budgets by category on Android, opening a category and one of its transactions.',
  },
  'investolio-demo': {
    id: 'investolio-demo',
    mp4: '/media/investolio-demo.mp4',
    webm: '/media/investolio-demo.webm',
    poster: '/media/investolio-demo.jpg',
    alt: 'Investolio dividend tracker on iPhone, demo account: the dashboard, then dividends, then holdings.',
  },
}
