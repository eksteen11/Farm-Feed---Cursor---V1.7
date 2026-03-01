import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | '3d'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  className,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-3xl transition-all duration-400'
  
  const variantClasses = {
    default: 'card',
    elevated: 'card-premium',
    outlined: 'border-2 border-gray-200 shadow-none',
    '3d': 'card-3d bg-white shadow-3xl border border-slate-100/50',
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-6',
    md: 'p-8 md:p-12',
    lg: 'p-12 md:p-16',
  }
  
  const hoverClasses = hover
    ? 'cursor-pointer'
    : ''
  
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className
  )
  
  if (variant === '3d') {
    return (
      <div className={classes} {...props}>
        <div className="card-3d-content">
          {children}
        </div>
      </div>
    )
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

// Card sub-components for better composition
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
)

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
)

const CardSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={clsx('text-sm text-gray-600 mt-1', className)}>
    {children}
  </p>
)

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={clsx('text-sm text-gray-500', className)}>
    {children}
  </p>
)

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('', className)}>
    {children}
  </div>
)

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
)

export { Card, CardHeader, CardTitle, CardSubtitle, CardDescription, CardContent, CardFooter }




