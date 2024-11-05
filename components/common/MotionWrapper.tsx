'use client'
import { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  className?: string
}

export default function MotionWrapper({ children, className = '' }: MotionWrapperProps) {
  return (
    <div 
      className={`animate-fadeIn ${className}`}
    >
      {children}
    </div>
  )
} 