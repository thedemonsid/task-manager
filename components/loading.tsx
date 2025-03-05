"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-4 flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Pulsing emoji */}
          <div className="inline-block text-4xl mb-6 animate-pulse">⏳</div>

          {/* Loading title with shimmer effect */}
          <div className="h-12 w-64 bg-zinc-800/60 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent shimmer-animation"></div>
          </div>

          {/* Loading description with shimmer effect */}
          <div className="h-6 w-80 bg-zinc-800/60 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent shimmer-animation"></div>
          </div>

          {/* Loading buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 w-32 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 border border-zinc-700 bg-zinc-800/20 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Features Section Loading Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50 backdrop-blur-sm"
            >
              {/* Feature icon placeholder */}
              <div className="w-12 h-12 rounded-full bg-zinc-700/50 animate-pulse mb-4"></div>

              {/* Feature title placeholder */}
              <div className="h-6 w-36 bg-zinc-700/50 rounded mb-3 animate-pulse"></div>

              {/* Feature description placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700/50 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-zinc-700/50 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-zinc-700/50 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Loading */}
        <div className="mt-20 text-center">
          {/* CTA title placeholder */}
          <div className="h-8 w-64 bg-zinc-800/60 rounded-lg mx-auto mb-4 animate-pulse"></div>

          {/* CTA description placeholder */}
          <div className="space-y-2 max-w-2xl mx-auto mb-8">
            <div className="h-4 bg-zinc-700/50 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-zinc-700/50 rounded w-5/6 mx-auto animate-pulse"></div>
          </div>

          {/* CTA button placeholder */}
          <div className="h-12 w-36 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-animation {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
