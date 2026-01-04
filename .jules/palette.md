## 2024-05-23 - Accessibility Patterns for Settings
**Learning:** Using `role="group"` combined with `aria-pressed` on buttons is a clean, accessible pattern for "segment controls" or toggle groups where visual design (buttons) differs from semantic structure (radio buttons). It avoids the need to restyle native radio inputs while preserving semantic meaning for screen readers.
**Action:** Apply this pattern to other button-based selection groups (like Tattoo Mode or Tier Selection) instead of custom divs or unsemantic buttons.

## 2024-05-24 - Accessible Dynamic Loading States
**Learning:** When using witty or dynamic loading text (e.g., "Mixing ink...", "Sketching..."), wrapping the container in `aria-live="polite"` ensures screen reader users receive these updates, preventing the "silent loading" frustration.
**Action:** Ensure all custom loading indicators with changing text use `aria-live`.

## 2024-05-25 - Contextual Character Counts
**Learning:** Simple visual character counts (e.g., "0/500") are confusing for screen reader users ("Zero slash five hundred"). Adding visually hidden text (e.g., "Characters used:") and linking via `aria-describedby` provides context without the annoyance of `aria-live` announcing every keystroke.
**Action:** Always wrap numeric limits/counters with context and link them to their inputs.

## 2026-01-04 - Semantic Lists for Interactive Rails
**Learning:** Horizontal scroll "rails" (common in mobile designs) are often implemented as `div` soup. Converting them to semantic `ul` > `li` structures with an `aria-label` significantly improves navigation context for screen reader users ("List of 6 items") without breaking the flex/snap layout behavior.
**Action:** Default to `ul` for any horizontal scrolling collection of uniform items, even if they look like buttons.
