import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TechStackToastProps {
  onClose: () => void;
}

const TechStackToast: React.FC<TechStackToastProps> = ({ onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/90 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <span className="text-sm font-semibold text-white">🚀</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">
                Tech Stack Ready
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Platform menggunakan teknologi terdepan untuk performa optimal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 text-slate-400 transition-colors hover:text-white"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechStackToast;
