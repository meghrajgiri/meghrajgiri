"use client";

import React, { useState } from "react";

type SkillCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
};

export default function SkillCard({ icon, title, description, index = 0 }: SkillCard) {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = [
    'from-purple-500/10 via-pink-500/10 to-red-500/10',
    'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
    'from-green-500/10 via-emerald-500/10 to-blue-500/10',
    'from-orange-500/10 via-red-500/10 to-pink-500/10',
    'from-indigo-500/10 via-purple-500/10 to-pink-500/10',
    'from-cyan-500/10 via-blue-500/10 to-indigo-500/10',
  ];

  const iconGradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500', 
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
  ];

  return (
    <div 
      className={`group relative min-h-[280px] transform-gpu transition-all duration-700 ease-out ${
        isHovered ? 'scale-105 -translate-y-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered 
          ? 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.05) translateY(-8px)' 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)',
      }}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${iconGradients[index % iconGradients.length]} rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-700`}></div>
      
      {/* Main card */}
      <div className={`relative h-full backdrop-blur-xl bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center text-center`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 h-32 w-32 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 h-32 w-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 h-32 w-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 h-1 w-1 bg-white rounded-full opacity-70 animate-ping"></div>
          <div className="absolute bottom-8 left-6 h-1 w-1 bg-purple-300 rounded-full opacity-70 animate-ping animation-delay-1000"></div>
          <div className="absolute top-1/2 right-8 h-1 w-1 bg-pink-300 rounded-full opacity-70 animate-ping animation-delay-2000"></div>
        </div>
        
        {/* Icon container with crazy effects */}
        <div className={`relative mb-6 flex items-center justify-center transform transition-all duration-500 ${
          isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${iconGradients[index % iconGradients.length]} rounded-full blur-md opacity-60 animate-pulse`}></div>
          <div className={`relative h-16 w-16 sm:h-18 sm:w-18 lg:h-20 lg:w-20 bg-gradient-to-r ${iconGradients[index % iconGradients.length]} rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20`}>
            <div className="text-white transform transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute top-0 left-1/2 h-2 w-2 bg-white rounded-full -translate-x-1/2 -translate-y-1"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 bg-purple-300 rounded-full -translate-x-1/2 translate-y-1"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className={`mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${iconGradients[index % iconGradients.length]} bg-clip-text text-transparent transition-all duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}>
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {description}
          </p>
        </div>

        {/* Interactive elements */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex space-x-1">
            <div className="h-1 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <div className="h-1 w-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            <div className="h-1 w-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
