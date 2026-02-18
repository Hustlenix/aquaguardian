'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('AquaGuardian error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#010B13',
            color: '#CBD5E1',
            fontFamily: 'Inter, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            The current drifts have hidden this location.
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              borderRadius: '16px',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              background: 'transparent',
              color: '#D4AF37',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Surface Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
