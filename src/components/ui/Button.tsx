'use client'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
}: ButtonProps) {
  const cls =
    variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : 'btn-secondary'

  if (href) {
    return (
      <a href={href} className={`${cls} ${className}`}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={`${cls} ${className}`}>
      {children}
    </button>
  )
}
