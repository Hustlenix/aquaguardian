'use client'

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  id?: string
}

export default function SectionWrapper({
  children,
  className = '',
  id,
}: Props) {
  return (
    <section id={id} className={`section-padding ${className}`}>
      <div className="section-inner">{children}</div>
    </section>
  )
}
