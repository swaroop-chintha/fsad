import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = ({ events = [] }) => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today.getDate());

    // Get number of days in month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day index (Monday based index)
    const getFirstDayOffset = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday(0) to 6
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const offset = getFirstDayOffset(currentMonth, currentYear);

    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
        month: 'long',
    });

    return (
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-lg shadow-indigo-500/5 border border-white h-full relative overflow-hidden">
            {/* Subtle corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="font-bold text-xl text-gray-800 tracking-tight">
                    {monthName} {currentYear}
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 bg-white/50 hover:bg-white rounded-full text-indigo-400 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 bg-white/50 hover:bg-white rounded-full text-indigo-400 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center relative z-10">
                {days.map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 mb-2">
                        {day}
                    </div>
                ))}

                {/* Offset empty cells */}
                {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {dates.map(date => {
                    const isToday =
                        date === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear();

                    const isSelected = date === selectedDate;
                    
                    const hasEvent = events.some(e => {
                        if (!e.dueDate) return false;
                        const d = new Date(e.dueDate);
                        return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                    });

                    return (
                        <div key={date} className="flex justify-center flex-col items-center">
                            <button
                                onClick={() => setSelectedDate(date)}
                                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full relative z-10 transition-all 
                                    ${isSelected
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 font-bold scale-110'
                                        : isToday
                                            ? 'border-2 border-indigo-600 text-indigo-600 font-bold bg-indigo-50'
                                            : 'text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                                    }`}
                            >
                                {date}
                            </button>
                            {/* Event Dot */}
                            {hasEvent && (
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 animate-pulse" />
                            )}
                            {!hasEvent && (
                                <div className="w-1.5 h-1.5 mt-1 opacity-0" />
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Quick Summary of Selected Date */}
            <div className="mt-8 pt-6 border-t border-gray-100/50">
                <p className="text-sm font-bold text-gray-800 mb-2">Schedule</p>
                {events.filter(e => {
                    const d = new Date(e.dueDate);
                    return d.getDate() === selectedDate && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                }).length > 0 ? (
                    <ul className="space-y-2">
                        {events.filter(e => {
                            const d = new Date(e.dueDate);
                            return d.getDate() === selectedDate && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                        }).map((ev, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                <span className="truncate">{ev.title} Due</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400">No deadlines for this date.</p>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;