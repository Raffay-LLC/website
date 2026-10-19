# Device frame licences

Both frames are official first-party assets. The transparent screen areas are
untouched; the files were only resized and re-encoded to WebP by
`scripts/build-devices.mjs`.

## iphone-17-pro-max-silver.webp

- Asset: iPhone 17 Pro Max, Silver, portrait, from the Product Bezels download.
- Source: https://developer.apple.com/design/resources/#product-bezels
  (https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-17.dmg,
  downloaded 2026-10-19; no login was required).
- Terms: "License Agreement for Apple Design Resources" shown with the download.
  It grants a limited licence to use the resources for mock-ups of interfaces for
  Apple platforms, and the Design Resources page says that bezels used in
  marketing materials must follow Apple's Marketing Resources and Identity
  Guidelines (https://developer.apple.com/app-store/marketing/guidelines/).
  The DMG's licence text also says the resources may not be used to create
  "website content" except as Apple expressly permits. The page's marketing
  permission is the basis for use here: the bezel shows Tiercel's own apps
  (Finly, Investolio). Review before wider reuse. Apple, iPhone and the iPhone
  design are trademarks of Apple Inc.

## pixel-10-pro.webp

- Asset: Pixel 10 Pro, portrait, from Google's Android Studio device art
  (`back.webp`: the bezel and body with a transparent screen; `mask.webp` and
  `layout` are not used).
- Source: https://android.googlesource.com/platform/tools/adt/idea/+/refs/heads/mirror-goog-studio-main/artwork/resources/device-art-resources/pixel_10_pro/
  (Android Open Source Project, `platform/tools/adt/idea`, path
  `artwork/resources/device-art-resources/pixel_10_pro/back.webp`, downloaded
  2026-10-19; no login was required).
- Terms: the files are in Google's open-source Android Studio repository, whose
  source files carry the header "Copyright (C) 2026 Google Inc. Licensed under
  the Apache License, Version 2.0" (http://www.apache.org/licenses/LICENSE-2.0),
  which permits use, modification and distribution, including commercial use,
  with attribution and without implying endorsement. The image files do not
  carry their own header; the repository's licence is the basis here. This
  replaces the Pixel 6 Pro frame from the Device Art Generator, which was flat
  black, vanished on dark backgrounds and is two generations older; the
  Generator offers no newer Pixel. The Pixel 10 Pro frame has a bright
  silver-lilac metal edge. Pixel and Android are trademarks of Google LLC; use of
  the marks follows https://developer.android.com/distribute/marketing-tools/brand-guidelines.
