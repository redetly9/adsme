import type { ErrorInfo, ReactNode } from 'react'
import React from 'react'

import { ErrorBoundaryError } from '~components/error-boundary-error'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Обновляем состояние, чтобы следующий рендер показал запасной UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryError />
    }

    return this.props.children
  }
}

export default ErrorBoundary
