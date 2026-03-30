import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));
        
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        info: 'bg-indigo-500'
    };

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info
    };

    const Icon = icons[type] || Info;

    return (
        <div 
            className={`flex items-center shadow-2xl rounded-xl text-white px-4 py-3 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'} ${bgColors[type] || bgColors.info}`}
        >
            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-medium mr-4 flex-grow text-sm">{message}</span>
            <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="hover:text-white/70 transition-colors focus:outline-none flex-shrink-0">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
