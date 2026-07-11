interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  strong?: boolean
}

export default function GlassPanel({
  children,
  className = '',
  strong = false,
}: GlassPanelProps) {
  return (
    <div
      className={`${
        strong ? 'glass-panel-strong' : 'glass-panel'
      } p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  )
}
