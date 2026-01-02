## 2025-12-19 - Virtualization vs Memoization
**Learning:** For lists of items with internal state or complex rendering, extracting to a memoized component is a quick win. Virtualization is better for very long lists, but memoization + lazy loading is often sufficient for medium lists and easier to implement.
**Action:** Always check loop rendering behavior and apply React.memo() when parent re-renders frequently.

## 2026-01-02 - Grid Item Memoization
**Learning:** Extracting grid items (buttons) into their own `React.memo` components significantly reduces re-renders when selection state changes. Passing `isSelected` as a boolean prop instead of passing the entire parent state allows `React.memo` to skip re-rendering for items that weren't interacted with.
**Action:** When creating selection grids, always create a separate, memoized component for the item to prevent O(n) re-renders on every selection change.
