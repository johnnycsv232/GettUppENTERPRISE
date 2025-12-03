/**
 * @file MagneticButton.tsx
 * @description Animated CTA button with magnetic hover effect
 * @module components/ui/MagneticButton
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MagneticButtonProps {
  /** Button content */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Button variant */
  variant?: 'gold' | 'pink' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * MagneticButton - Animated button that "pulls" users toward it
 * Uses Framer Motion for smooth scale animations on hover/tap
 */
export function MagneticButton({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  variant = 'gold',
  size = 'md',
  type = 'button',
}: MagneticButtonProps) {
  
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    gold: 'bg-[var(--brand-gold)] text-[var(--brand-ink)] hover:bg-[#c9a03d] focus:ring-[var(--brand-gold)]',
    pink: 'bg-[var(--brand-pink)] text-white hover:bg-[#e6357f] focus:ring-[var(--brand-pink)]',
    outline: 'border-2 border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-ink)]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 1.0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

export default MagneticButton;
