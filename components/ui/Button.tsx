import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
            'bg-surface-container-lowest text-on-surface border border-outline-variant/50 hover:bg-surface': variant === 'secondary',
            'bg-error-bg text-error-text border border-error-border hover:bg-red-100': variant === 'destructive',
            'hover:bg-surface text-on-surface': variant === 'ghost',
            'h-8 px-3 font-label-sm text-label-sm': size === 'sm',
            'h-11 px-5 font-body-sm text-body-sm': size === 'md',
            'h-14 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

