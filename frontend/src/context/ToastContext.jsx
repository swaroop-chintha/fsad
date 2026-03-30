import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast 
                            message={toast.message} 
                            type={toast.type} 
                            duration={toast.duration} 
                            onClose={() => removeToast(toast.id)} 
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
