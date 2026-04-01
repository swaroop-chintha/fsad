import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import EventFormModal from './EventFormModal';

const CalendarWidget = ({ events = [], calendarEvents = [], onAddEvent, isTeacher = false }) => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today.getDate());
    const [showEventModal, setShowEventModal] = useState(false);

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

    // Check if a date has assignment deadlines (existing events prop)
    const hasDeadline = (date) => {
        return events.some(e => {
            if (!e.dueDate) return false;
            const d = new Date(e.dueDate);
            return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    // Check if a date has calendar events (new calendarEvents prop)
    const hasCalendarEvent = (date) => {
        return calendarEvents.some(e => {
            if (!e.eventDate) return false;
            const d = new Date(e.eventDate + 'T00:00:00');
            return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    // Get calendar events for a specific date
    const getCalendarEventsForDate = (date) => {
        return calendarEvents.filter(e => {
            if (!e.eventDate) return false;
            const d = new Date(e.eventDate + 'T00:00:00');
            return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    // Get assignment deadlines for a specific date
    const getDeadlinesForDate = (date) => {
        return events.filter(e => {
            if (!e.dueDate) return false;
            const d = new Date(e.dueDate);
            return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    const handleAddEvent = async (formData) => {
        if (onAddEvent) {
            await onAddEvent(formData);
        }
    };

    const selectedDeadlines = getDeadlinesForDate(selectedDate);
    const selectedCalEvents = getCalendarEventsForDate(selectedDate);

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-lg shadow-indigo-500/5 border border-white dark:border-gray-700 h-full relative overflow-hidden transition-colors duration-300">
            {/* Subtle corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
                    {monthName} {currentYear}
                </h3>

                <div className="flex gap-2 items-center">
                    {/* Add Event Button */}
                    {onAddEvent && (
                        <button
                            onClick={() => setShowEventModal(true)}
                            className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full text-white transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-105"
                            title="Add event"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 rounded-full text-indigo-400 dark:text-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 rounded-full text-indigo-400 dark:text-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center relative z-10">
                {days.map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2">
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
                    
                    const dateHasDeadline = hasDeadline(date);
                    const dateHasCalEvent = hasCalendarEvent(date);

                    return (
                        <div key={date} className="flex justify-center flex-col items-center">
                            <button
                                onClick={() => setSelectedDate(date)}
                                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full relative z-10 transition-all 
                                    ${isSelected
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 font-bold scale-110'
                                        : isToday
                                            ? 'border-2 border-indigo-600 text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/30'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-indigo-600 hover:shadow-sm'
                                    }`}
                            >
                                {date}
                            </button>
                            {/* Event Dots */}
                            <div className="flex gap-1 mt-1 h-1.5">
                                {dateHasDeadline && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                )}
                                {dateHasCalEvent && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                )}
                                {!dateHasDeadline && !dateHasCalEvent && (
                                    <div className="w-1.5 h-1.5 opacity-0" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Schedule Section for Selected Date */}
            <div className="mt-8 pt-6 border-t border-gray-100/50 dark:border-gray-700/50">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-3">Schedule</p>
                
                {selectedDeadlines.length === 0 && selectedCalEvents.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">No events for this date.</p>
                ) : (
                    <ul className="space-y-2">
                        {/* Assignment Deadlines */}
                        {selectedDeadlines.map((ev, idx) => (
                            <li key={`d-${idx}`} className="flex items-center gap-2 text-xs font-medium text-indigo-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                                <span className="truncate">{ev.title} Due</span>
                            </li>
                        ))}
                        {/* Calendar Events */}
                        {selectedCalEvents.map((ev, idx) => (
                            <li key={`c-${idx}`} className="flex items-center gap-2 text-xs font-medium text-purple-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                                <span className="truncate">
                                    {ev.title}
                                    {ev.eventTime && (
                                        <span className="text-purple-400 ml-1">
                                            at {ev.eventTime.substring(0, 5)}
                                        </span>
                                    )}
                                    {ev.global && (
                                        <span className="ml-1 text-[10px] bg-purple-100 text-purple-500 px-1.5 py-0.5 rounded-full">
                                            Global
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Legend */}
                {(calendarEvents.length > 0 || events.length > 0) && (
                    <div className="flex gap-4 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            Deadlines
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            Events
                        </div>
                    </div>
                )}
            </div>

            {/* Event Form Modal */}
            {showEventModal && (
                <EventFormModal
                    onClose={() => setShowEventModal(false)}
                    onSubmit={handleAddEvent}
                    isTeacher={isTeacher}
                />
            )}
        </div>
    );
};

export default CalendarWidget;