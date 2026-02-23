import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
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
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800">
                    {monthName} {currentYear}
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-indigo-600"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-indigo-600"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center">
                {days.map(day => (
                    <div key={day} className="text-xs font-medium text-gray-400 mb-2">
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

                    return (
                        <div key={date} className="flex justify-center">
                            <button
                                onClick={() => setSelectedDate(date)}
                                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full relative z-10 transition-all 
                                    ${isSelected
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                        : isToday
                                            ? 'border border-indigo-600 text-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {date}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;