import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-brand-primary mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm max-w-sm mb-8">
          An unexpected error occurred. Please refresh the page or go back to the homepage.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 text-sm font-semibold bg-brand-gradient text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Refresh page
          </button>
          <a
            href="/"
            className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
          >
            Go to homepage
          </a>
        </div>
      </div>
    );
  }
}
