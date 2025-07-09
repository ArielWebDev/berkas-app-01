import React from 'react';
import { 
  SiLaravel, 
  SiReact, 
  SiTypescript, 
  SiVite, 
  SiMysql,
  SiTailwindcss
} from 'react-icons/si';

interface TechStackBackgroundProps {
  className?: string;
}

export default function TechStackBackground({ className = "" }: TechStackBackgroundProps) {
  const technologies = [
    { icon: SiLaravel, name: "Laravel", color: "text-red-500", delay: "0s" },
    { icon: SiReact, name: "React", color: "text-blue-500", delay: "0.5s" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600", delay: "1s" },
    { icon: SiVite, name: "Vite", color: "text-purple-500", delay: "1.5s" },
    { icon: SiMysql, name: "MySQL", color: "text-orange-500", delay: "2s" },
    { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-500", delay: "2.5s" },
  ];

  // Generate random positions for floating icons
  const positions = [
    { top: '10%', left: '15%' },
    { top: '25%', right: '20%' },
    { top: '45%', left: '10%' },
    { top: '60%', right: '15%' },
    { top: '80%', left: '25%' },
    { top: '35%', right: '30%' },
  ];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Floating Tech Icons */}
      {technologies.map((tech, index) => {
        const IconComponent = tech.icon;
        const position = positions[index];
        
        return (
          <div
            key={tech.name}
            className="absolute animate-float-gentle opacity-20 hover:opacity-40 transition-opacity duration-500"
            style={{
              ...position,
              animationDelay: tech.delay,
              animationDuration: `${8 + index * 2}s`
            }}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-current to-transparent opacity-30 blur-xl scale-150 animate-pulse"></div>
              
              {/* Main icon */}
              <IconComponent 
                className={`w-12 h-12 ${tech.color} drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
              />
              
              {/* Subtle label that appears on hover */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {tech.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="tech-grid"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-indigo-500/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Subtle code-like background pattern */}
      <div className="absolute bottom-4 right-4 opacity-5 font-mono text-xs leading-relaxed">
        <div className="space-y-1">
          <div>&lt;?php namespace App\Models;</div>
          <div>import React from 'react';</div>
          <div>SELECT * FROM users;</div>
          <div>@tailwind base;</div>
          <div>npm run dev</div>
        </div>
      </div>
    </div>
  );
}
