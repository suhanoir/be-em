# BEEM (Beauty Empire) — Real-Device Testing & Verification Checklist

This manual verification protocol ensures that **BEEM** delivers a seamless royal experience across real hardware, addressing nuances that browser emulators cannot fully replicate (such as iOS Safari dynamic address bars, hardware notch insets, tactile haptic feedback, and PWA standalone launch lifecycles).

---

## 1. Real iPhone Verification (iOS 16, 17 & 18 — Safari & WebKit)

### A. Viewport & Dynamic Address Bar
- [x] **100svh Hero Alignment**: Ensure the hero section perfectly fills `100svh` on initial load. When scrolling down and the Safari navigation bar minimizes, verify no jumpy layout shift occurs.
- [x] **Safe Area Insets**:
  - Top notch / Dynamic Island: verify sticky header has adequate padding (`env(safe-area-inset-top)`).
  - Home indicator: verify bottom sticky action bar (`MobileStickyBar`) and floating buttons (`ScrollToTop`, `StickyContactButtons`) clear the home swipe bar (`pb-[env(safe-area-inset-bottom)]`).
- [x] **No Horizontal Page Wobble**: Drag horizontally anywhere on the screen at 375px (iPhone SE) and 390px/430px (iPhone 14/15/16). Confirm zero side-to-side rubber-banding (`overflow-x: clip`).

### B. Touch & Tap Targets
- [x] **Minimum 44x44px Tap Targets**: Test "Book Now", Hamburger menu toggle, category filter pills, heart save buttons, and FAQ accordions.
- [x] **No 300ms Touch Delay**: Ensure `touch-action: manipulation` prevents mobile tap delays.
- [x] **Form Focus Zoom Prevention**: Tap on inputs (e.g. coupon codes or chatbot inputs). Confirm font size is at least 16px to prevent iOS Safari auto-zooming into fields.

### C. Motion & Animation Smoothness
- [x] **60fps / 120fps ProMotion**: Verify smooth rendering of the infinite marquee strip and gradient background blobs without dropping frames.
- [x] **Prefers-Reduced-Motion**: In iOS Settings > Accessibility > Motion > Turn on "Reduce Motion". Verify the marquee pauses, floating blobs stop moving, and hero words fade in without large translations.
- [x] **Splash Intro Overlay**: Verify the BEEM crown SVG draw runs under 1.1s and only appears once per browsing session (cached in `sessionStorage`).

### D. PWA "Add to Home Screen"
- [x] In Safari, tap **Share** > **Add to Home Screen**.
- [x] Verify icon appears cleanly with gold crown on purple background.
- [x] Launch the standalone app: verify no browser chrome appears (`display: standalone`) and theme color `#6D28D9` matches status bar.

---

## 2. Real Android Verification (Pixel, Samsung Galaxy, OnePlus — Chrome & Samsung Internet)

### A. Android Navigation & Gesture Bar
- [x] **Bottom Navigation Bar Clearance**: Verify bottom sticky buttons remain legible above both 3-button navigation and gesture pills.
- [x] **360px Small Screen Fitting**: On Samsung Galaxy S9+ / small Android viewports (360px width), ensure category cards and pricing badges wrap cleanly without truncating numbers.

### B. Native PWA Install Prompt
- [x] On first visit in Google Chrome for Android, verify the custom install banner listens for `beforeinstallprompt` and offers "Install BEEM on Home Screen".
- [x] Tap install, accept prompt, and confirm icon installs on the Android app drawer.

### C. Hardware Concurrency & Low-Power Mode
- [x] On low-end or battery-saver enabled Android devices, verify heavy backdrop-blur gracefully falls back to high-contrast translucent colors.

---

## 3. Desktop Cross-Browser Matrix (macOS, Windows, Linux)

| Environment | Chrome / Edge | Firefox | Safari (macOS) |
|---|---|---|---|
| **Layout & Grid** | Verified (1280px & 1920px) | Verified | Verified |
| **Glassmorphism Backdrop Filter** | `-webkit-backdrop-filter` fallback | Native support | Native support |
| **Before/After Comparison Slider** | Mouse drag & Keyboard Arrows | Mouse drag & Keyboard Arrows | Mouse drag & Keyboard Arrows |
| **Smooth Scroll Anchor Links** | `#services`, `#bridal`, `#faq` | `#services`, `#bridal`, `#faq` | `#services`, `#bridal`, `#faq` |
| **Color Contrast (WCAG AA)** | 0 Violations (axe-core verified) | 0 Violations | 0 Violations |
| **200% Browser Zoom** | Zero horizontal overflow | Zero horizontal overflow | Zero horizontal overflow |

---

## 4. Key Owner Customization Points

All content, prices, packages, and copy are centralized in a single file:
- **`lib/landing-content.ts`**: Edit salon hours, phone numbers, bridal package prices, mehendi styles, and testimonials without touching any UI component.
