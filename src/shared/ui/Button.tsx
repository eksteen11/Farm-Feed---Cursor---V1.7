import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 min-h-[56px] py-4 px-8 rounded-2xl transition-all duration-300',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[56px]',
    lg: 'px-8 py-4 text-lg min-h-[64px]',
  }
  
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )
  
  return (
    <button
      className={`${classes} relative overflow-hidden group`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
      
      {/* Ripple effect container */}
      <span className="absolute inset-0 overflow-hidden rounded-2xl">
        <span className="absolute inset-0 scale-0 group-active:scale-100 opacity-0 group-active:opacity-100 transition-all duration-300 bg-white/30 rounded-full"></span>
      </span>
      
      {/* Content */}
      <span className="relative z-10 flex items-center">
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && leftIcon && (
          <span className="mr-2 transition-transform duration-300 group-hover:scale-110">{leftIcon}</span>
      )}
      
        <span className="transition-opacity duration-300">{children}</span>
      
      {!isLoading && rightIcon && (
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">{rightIcon}</span>
      )}
      </span>
    </button>
  )
}

export default Button
















