import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: AlertCircle
    };

    const Icon = icons[type];

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center shadow-lg rounded-lg text-white px-4 py-3 transition-opacity duration-300 ${bgColors[type]}`}>
            <Icon className="h-5 w-5 mr-3" />
            <span className="font-medium mr-4">{message}</span>
            <button onClick={onClose} className="hover:opacity-75">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;
