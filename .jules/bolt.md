## 2025-12-19 - Virtualization vs Memoization
**Learning:** For lists of items with internal state or complex rendering, extracting to a memoized component is a quick win. Virtualization is better for very long lists, but memoization + lazy loading is often sufficient for medium lists and easier to implement.
**Action:** Always check loop rendering behavior and apply React.memo() when parent re-renders frequently.

## 2026-01-01 - StyleGrid Optimization
**Learning:** When a list component receives a selected item ID prop (e.g., `selectedStyle`), updating that prop causes the entire list to re-render. By extracting the list item into a `React.memo` component, we ensure that only the previously selected item (becoming unselected) and the newly selected item (becoming selected) re-render.
**Action:** Identify grids/lists with selection state and extract the item component with `React.memo`.
