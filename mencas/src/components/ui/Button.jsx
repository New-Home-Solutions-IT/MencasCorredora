import React from 'react'
import { twMerge } from 'tailwind-merge'

const Button = ({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'

  const variants = {
    default: 'bg-white text-black hover:bg-gray-200',
    outline: 'border border-white text-white hover:bg-white hover:text-black',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  }

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  }

  return (
    <button
      className={twMerge(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
