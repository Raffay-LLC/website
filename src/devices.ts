import type { DeviceKind } from './content'

/**
 * Official device frames. Each frame is a PNG-with-alpha (stored as WebP) whose
 * screen is transparent. The numbers were measured from that transparent
 * region, as percentages of the frame image: left, top, width and height of
 * the screen, and its corner radius as a percentage of the frame's width.
 * Licences: public/devices/LICENSES.md.
 */
export type DeviceFrame = {
  src: string
  /** Pixel size of the stored frame image. */
  width: number
  height: number
  screen: {
    left: number
    top: number
    width: number
    height: number
    radius: number
  }
  /** Accessible name of the device type. */
  label: string
}

export const devices: Record<DeviceKind, DeviceFrame> = {
  // Apple Design Resources, Product Bezels: iPhone 17 Pro Max, Silver, portrait.
  iphone: {
    src: '/devices/iphone-17-pro-max-silver.webp',
    width: 820,
    height: 1673,
    screen: { left: 5, top: 2.152, width: 90, height: 95.696, radius: 13.168 },
    label: 'iPhone',
  },
  // Google, Android Studio device art (AOSP, Apache-2.0): Pixel 10 Pro, portrait.
  android: {
    src: '/devices/pixel-10-pro.webp',
    width: 820,
    height: 1726,
    screen: { left: 4.024, top: 1.97, width: 91.098, height: 96.35, radius: 12.958 },
    label: 'Android phone',
  },
}
