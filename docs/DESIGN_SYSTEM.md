# Design system

Current visual baseline: Premium Editorial AI, light ivory, charcoal and restrained
teal/gold. The source of exact behavior is the shared CSS plus component/route CSS
Modules. This guide explains the rules; approved redesigns can supersede them.

## Foundations

Tokens live inside `.site-shell` in `app/globals.css`, so portfolio styling stays
separate from Studio.

| Token | Value |
| --- | --- |
| Background / surface / muted surface | `#f7f5ef` / `#ffffff` / `#eeece5` |
| Text / muted text | `#202b30` / `#576369` |
| Accent / accent hover | `#24665e` / `#194c46` |
| Gold / border / focus | `#946b2d` / `#d8dcd5` / `#24665e` |

Geist Sans is used for public text; Geist Mono for code. Base text is 1rem with
1.65 line height. Shared headings use weight 600, line height 1.12 and tracking
-0.035em. Large headings scale from 2.5rem to 4.75rem; medium from 1.875rem to
3rem. Individual editorial pages have their own typography overrides.

Container maximum: 75rem. Horizontal allowance: 2.5rem total, increasing to 4rem
at 48rem viewport width. Section vertical padding uses clamp(3.5rem, 7vw, 6.5rem).
Shared copy is capped at 65ch. Buttons have a 2.75rem minimum height and 0.5rem
radius; base cards use 0.75rem radius, subtle border and shadow.

## Layout and interaction rules

- Use existing buttons, headings, cards, badges and empty states. Preserve visible
  focus, semantic headings and keyboard operation.
- Public desktop navigation starts at 75rem. Narrow layouts use the mobile Menu;
  do not assume common framework breakpoint defaults match this implementation.
- Homepage featured project cards and archive listing cards are distinct variants.
  Archives use one column below 64rem and two from 64rem. Listing thumbnails are
  16:10; narrow layouts omit summary/technology details. At 40rem and above the
  summary is limited to two lines. Titles remain complete.
- Stretched card title links provide one keyboard stop. Secondary interactive
  controls must not overlap that link target.
- Case-study prose is centered within a 44rem column; wider images are intentional.
  Blog prose also uses a centered 44rem column with left-aligned body copy.
- Optional content disappears cleanly. Empty blog and hidden resume are accepted
  launch behavior, not missing UI to fill with placeholder content.

## Image contracts

- Portrait: 4:5 crop with saved Sanity crop/hotspot. Homepage width caps are
  14rem mobile, 16rem tablet and 20rem desktop; hero image is preloaded.
- Detail cover: distinct 16:9 presentation requested at 1440 x 810.
- Project screenshots and Project/Blog body images use the shared screenshot
  presentation through ContentImage/RichText. Saved crop is respected; display
  sizing adds no further crop or stretching.
- Display sizes: Auto, Compact (28rem), Standard (42rem), Wide (56rem). Auto uses
  orientation-based width caps: tall 22rem, portrait 26rem, square 36rem,
  landscape 56rem. Native width and available space also constrain the figure.
- Screenshot preview sizing additionally bounds proportional height to 26rem
  on mobile and 32rem on desktop. Captions align with the displayed figure.
- View full image opens the saved composition in a new tab; it does not promise
  the uncropped source or restore detail absent from low-resolution uploads.
- Missing/invalid references and unusable alt text must not create broken images.
  Portrait may use the profile name as its alt fallback.

## Motion

Existing motion is CSS color/background/border feedback, generally 150–180ms
with ease-out, enabled for appropriate hover/reduced-motion conditions. There
is no animation library in the reviewed package dependencies. Reduced-motion
rules disable animations/transitions and restore automatic scrolling.

For requested advanced animation, keep content readable without animation,
preserve focus and reduced-motion behavior, and check mobile layout/performance.
Do not add scroll interception, entrance effects or a new library incidentally
while implementing an unrelated change.

## Visual evidence and verification

The owner accepted V1 desktop/mobile layouts, keyboard navigation and 200% zoom.
No dedicated visual-reference screenshot set is included in this handover yet.
Before a visual change, capture relevant desktop/mobile before views and record
URL, viewport, date and source checkpoint. CMS content may differ at the same
Git checkpoint. Avoid account dashboards and private editor content in shared
screenshots. Compare the affected after views, including long titles, absent
optional fields and related shared-component callers.
