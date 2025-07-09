import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface BuildInfoBannerProps {
  onClose: () => void;
}

const BuildInfoBanner: React.FC<BuildInfoBannerProps> = ({ onClose }) => {
  return (
    <div className="fixed left-0 right-0 top-16 z-40">
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-4 py-2 text-white backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-lg">ℹ️</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Build Info:</span>
              <span className="ml-1 opacity-90">
                Laravel 11 + React + TypeScript + Tailwind CSS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildInfoBanner;
