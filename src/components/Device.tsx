import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react'
import type { Clip, DeviceKind } from '../content'
import { devices } from '../devices'
import { getPaused, getServerPaused, setPaused, subscribe, useMotionAllowed } from '../lib/motion'

/** One small icon-only control that pauses or plays every recording on the page. */
export function MotionToggle() {
  const isPaused = useSyncExternalStore(subscribe, getPaused, getServerPaused)
  const label = isPaused ? 'Play recordings' : 'Pause recordings'
  return (
    <button type="button" className="motion-toggle" aria-label={label} title={label} onClick={() => setPaused(!isPaused)}>
      <span className={`motion-icon${isPaused ? ' is-play' : ''}`} aria-hidden="true" />
    </button>
  )
}

/**
 * Safari only allows autoplay for a video it knows is muted, and React does not
 * write the `muted` attribute into the DOM. So every property and attribute
 * that autoplay policy reads is set here, before play() is ever called.
 */
function prepareVideo(el: HTMLVideoElement) {
  el.muted = true
  el.defaultMuted = true
  el.setAttribute('muted', '')
  el.playsInline = true
  el.setAttribute('playsinline', '')
  el.setAttribute('webkit-playsinline', '')
  el.controls = false
  el.removeAttribute('controls')
  el.disablePictureInPicture = true
}

/**
 * A real screen recording. Plays only while it is on screen and motion is
 * allowed. A real <img> of the poster frame sits over the video and fades out
 * once the video reports `playing`, so the screen never shows a blank, a black
 * frame or a native play button, whatever the browser decides.
 */
export function DeviceVideo({ clip, eager = false }: { clip: Clip; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useRef(false)
  const allowed = useMotionAllowed()

  const setVideo = useCallback((el: HTMLVideoElement | null) => {
    ref.current = el
    if (el) prepareVideo(el)
  }, [])

  useEffect(() => {
    const video = ref.current
    const box = wrap.current
    if (!video || !box) return

    const shouldPlay = () => visible.current && allowed
    const showVideo = () => {
      box.dataset.playing = ''
    }
    let tries = 0
    let timer = 0
    let armed = false
    // After a refusal, the first touch, click or key press is a user gesture
    // that browsers accept for playback. Arm that retry once, and re-arm if
    // it is refused again.
    const onGesture = () => {
      armed = false
      tries = 0
      attempt()
    }
    const arm = () => {
      if (armed) return
      armed = true
      for (const type of ['touchend', 'pointerdown', 'keydown']) {
        window.addEventListener(type, onGesture, { once: true, passive: true })
      }
    }
    const attempt = () => {
      if (!shouldPlay() || !video.paused) return
      prepareVideo(video)
      video.play().then(
        () => {
          tries = 0
        },
        () => {
          // Refused (Low Power Mode, data saver, or WebKit before first paint
          // or gesture). The poster stays showing. Ask again a few times, and
          // wait for a gesture.
          arm()
          if (tries < 8) {
            tries += 1
            window.clearTimeout(timer)
            timer = window.setTimeout(attempt, 350)
          }
        },
      )
    }
    const sync = () => {
      if (shouldPlay()) attempt()
      else video.pause()
    }

    video.addEventListener('playing', showVideo)
    // Safari can finish loading after the first refusal; ask again then.
    video.addEventListener('loadeddata', attempt)
    video.addEventListener('canplay', attempt)
    // Autoplay may already have started before React attached listeners.
    if (!video.paused && video.currentTime > 0) showVideo()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        sync()
      },
      { threshold: 0.2 },
    )
    io.observe(video)
    sync()
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      for (const type of ['touchend', 'pointerdown', 'keydown']) {
        window.removeEventListener(type, onGesture)
      }
      video.removeEventListener('playing', showVideo)
      video.removeEventListener('loadeddata', attempt)
      video.removeEventListener('canplay', attempt)
    }
  }, [allowed])

  return (
    <div ref={wrap} className="device-media-box">
      <video
        ref={setVideo}
        className="device-media"
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        poster={clip.poster}
        aria-label={clip.alt}
      >
        <source src={clip.mp4} type="video/mp4" />
        <source src={clip.webm} type="video/webm" />
      </video>
      <img
        className="device-poster"
        src={clip.poster}
        alt={clip.alt}
        width={480}
        height={1043}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        aria-hidden="true"
      />
    </div>
  )
}

/**
 * A real device frame with a screen recording playing inside its screen. The
 * recording sits under the frame, cropped to the frame's measured screen
 * rectangle and corner radius, so the frame's own bezel, camera cut-out and
 * edge highlights draw on top of it.
 */
export function Device({
  kind,
  clip,
  eager = false,
}: {
  kind: DeviceKind
  clip: Clip
  eager?: boolean
}) {
  const frame = devices[kind]
  const { screen } = frame
  return (
    <div
      className="device"
      data-device={kind}
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
    >
      <img
        className="device-shadow"
        src={frame.src}
        alt=""
        width={frame.width}
        height={frame.height}
        loading={eager ? 'eager' : 'lazy'}
        aria-hidden="true"
      />
      <div
        className="device-screen"
        style={
          {
            left: `${screen.left}%`,
            top: `${screen.top}%`,
            width: `${screen.width}%`,
            height: `${screen.height}%`,
            borderRadius: `${screen.radius}cqw`,
            clipPath: `inset(0 round ${screen.radius}cqw)`,
          } as CSSProperties
        }
      >
        <DeviceVideo clip={clip} eager={eager} />
      </div>
      <img
        className="device-frame"
        src={frame.src}
        alt=""
        width={frame.width}
        height={frame.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        aria-hidden="true"
      />
    </div>
  )
}
