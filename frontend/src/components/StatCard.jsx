import React from 'react';

const StatCard = ({ icon: Icon, label, value, subLabel, color, progress }) => {
    // Calculate circle circumference for SVG dasharray
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={`p-6 rounded-[2rem] ${color} relative overflow-hidden flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default group`}>
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full mix-blend-overlay filter blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500"></div>
            <div>
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mb-3 text-white">
                    <Icon size={20} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
                <p className="text-gray-800 font-semibold">{label}</p>
                <p className="text-xs text-gray-500 mt-1">{subLabel}</p>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-white/30"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-white"
                    />
                </svg>
                <span className="absolute text-xs font-bold text-gray-800">{progress}%</span>
            </div>
        </div>
    );
};

export default StatCard;
