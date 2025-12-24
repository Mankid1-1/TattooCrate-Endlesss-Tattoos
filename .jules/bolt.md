## 2025-12-19 - Virtualization vs Memoization
**Learning:** For lists of items with internal state or complex rendering, extracting to a memoized component is a quick win. Virtualization is better for very long lists, but memoization + lazy loading is often sufficient for medium lists and easier to implement.
**Action:** Always check loop rendering behavior and apply React.memo() when parent re-renders frequently.

## 2025-12-19 - Code Splitting Interactive Modals
**Learning:** Components conditionally rendered in modals (like editors or forms) are perfect candidates for `React.lazy`. Even if the parent component is lazy-loaded, splitting these children reduces the initial payload of the parent significantly.
**Action:** Identify large interactive components that are hidden by default and lazy load them.
