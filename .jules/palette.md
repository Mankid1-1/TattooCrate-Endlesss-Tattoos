## 2024-05-23 - Accessibility Patterns for Settings
**Learning:** Using `role="group"` combined with `aria-pressed` on buttons is a clean, accessible pattern for "segment controls" or toggle groups where visual design (buttons) differs from semantic structure (radio buttons). It avoids the need to restyle native radio inputs while preserving semantic meaning for screen readers.
**Action:** Apply this pattern to other button-based selection groups (like Tattoo Mode or Tier Selection) instead of custom divs or unsemantic buttons.

## 2024-05-24 - Accessible Dynamic Loading States
**Learning:** When using witty or dynamic loading text (e.g., "Mixing ink...", "Sketching..."), wrapping the container in `aria-live="polite"` ensures screen reader users receive these updates, preventing the "silent loading" frustration.
**Action:** Ensure all custom loading indicators with changing text use `aria-live`.
