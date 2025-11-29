import * as React from "react";

export function ListTodoIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}>
      <path d="M13 5h8m-8 7h8m-8 7h8M3 17l2 2l4-4" /><rect width="6" height="6" x="3" y="4" rx="1" />
    </svg>
  );
}
