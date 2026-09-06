import React from 'react';
import { reportError } from '@/lib/monitoring';

interface State {
  hasError: boolean;
}

/** Catches rendering crashes so visitors see a friendly message instead of a blank page. */
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Render error:', error, info.componentStack);
    void reportError(error, { componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="ltr">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">The page hit an unexpected error. Reloading usually fixes it.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
