
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen z-50 relative">
            <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-violet-500/30 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-violet-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-violet-300 text-sm font-medium animate-pulse">
                    Loading
                </div>
            </div>
        </div>
    );
};
