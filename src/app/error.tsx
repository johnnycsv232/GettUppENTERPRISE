'use client';

/**
 * @file error.tsx
 * @description Global error boundary for the application
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B0D] px-6">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FF3C93]/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#FF3C93]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 font-heading">
          Something went wrong
        </h1>
        
        <p className="text-gray-400 mb-8">
          We encountered an unexpected error. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#D9AE43] hover:bg-[#F4D03F] text-[#0B0B0D] font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="px-6 py-3 border border-white/20 hover:border-white/40 text-white font-bold rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-8 text-xs text-gray-600">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
