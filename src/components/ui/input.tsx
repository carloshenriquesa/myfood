import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputErrorProps {
  errorMessage: string
}
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, InputErrorProps {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, errorMessage, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col">
        <input
          type={type}
          className={cn(
            `
              flex h-9 w-full 
              rounded-md border border-input bg-transparent px-3 py-1 
              text-sm shadow-sm transition-colors 
              file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-muted-foreground 
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
              disabled:cursor-not-allowed disabled:opacity-50
            `,
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1 pl-2">{errorMessage}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
