import { FileText } from 'lucide-react';

interface ApplicationLogoProps {
  className?: string;
}

export default function ApplicationLogo({
  className = '',
}: ApplicationLogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2">
        <FileText className="h-6 w-6 text-white" />
      </div>
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
        BerkasApp
      </span>
    </div>
  );
}
