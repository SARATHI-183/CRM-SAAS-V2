// src/lib/utils.js

// Named export of `cn` function
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
