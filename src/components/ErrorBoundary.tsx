import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f1ec] dark:bg-[#0e0d0b] text-[#141210] dark:text-[#f4f1ec] flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#171513] p-8">
            <p className="text-xs tracking-[0.2em] uppercase text-[#b89362] mb-2">
              ASK MIDDLEMAN
            </p>
            <h1 className="font-serif text-3xl font-medium mb-3">
              Something interrupted this session.
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] hover:opacity-90 transition-opacity"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
