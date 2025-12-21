# Palette's Journal - Critical Learnings

## 2024-05-22 - [Initial Setup]
**Learning:** UX is a continuous process.
**Action:** Starting to log critical learnings.

## 2024-05-22 - [Tooltip Accessibility]
**Learning:** React's `onFocus` event on a wrapper `div` successfully bubbles up from interactive children, making it an effective way to trigger visibility for tooltips without modifying every child component. This simple change drastically improves keyboard accessibility for sighted users.
**Action:** When creating wrapper components that provide contextual information, always consider keyboard focus in addition to mouse hover.
