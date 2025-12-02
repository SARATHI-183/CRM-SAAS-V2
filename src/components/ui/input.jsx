import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
// import * as React from "react";
// import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }) {
//   return (
//     <input
//       type={type}
//       className={cn(
//         "h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400",
//         "hover:border-gray-400 hover:shadow-md",
//         "focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-500/20 outline-none",
//         "disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Input };
