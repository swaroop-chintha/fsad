import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, X } from 'lucide-react';

const UpcomingEvents = ({ courseId, isTeacher, eventsProp }) => {
    const [events, setEvents] = useState([]);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', eventDate: '', eventType: 'TEST' });

    useEffect(() => {
        if (eventsProp) {
            setEvents(eventsProp);
        } else if (courseId) {
            fetchEvents();
        } else {
            setEvents([]);
        }
    }, [courseId, eventsProp]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`/api/events/course/${courseId}`);
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            let formattedDate = newEvent.eventDate;
            if (formattedDate.length === 16) formattedDate += ":00";

            await axios.post('/api/events', null, {
                params: {
                    courseId,
                    title: newEvent.title,
                    eventDate: formattedDate,
                    eventType: newEvent.eventType
                }
            });
            setShowAddEvent(false);
            setNewEvent({ title: '', eventDate: '', eventType: 'TEST' });
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white dark:border-gray-700 shadow-sm relative overflow-hidden transition-all duration-300 mt-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl mr-3">
                        <Calendar className="text-indigo-600 dark:text-indigo-400 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
                </div>
                {isTeacher && courseId && (
                    <button onClick={() => setShowAddEvent(true)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold text-sm flex items-center transition-colors">
                        <Plus className="h-4 w-4 mr-1" /> Add New
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium italic">No upcoming events scheduled.</p>
                    </div>
                ) : (
                    events.map(ev => {
                        const d = new Date(ev.eventDate);
                        return (
                            <div key={ev.id} className="flex items-center space-x-4 p-4 bg-white/40 dark:bg-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all group">
                                <div className="bg-indigo-50 dark:bg-indigo-900/40 rounded-xl p-3 text-center min-w-[70px] border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-105 transition-transform">
                                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{d.getDate()}</div>
                                    <div className="text-[10px] text-indigo-400 dark:text-indigo-500 font-black uppercase tracking-widest mt-1">{d.toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{ev.title}</h4>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${ev.eventType === 'TEST' 
                                            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50' 
                                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'}`}>
                                            {ev.eventType}
                                        </span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold ml-3 flex items-center">
                                            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                                            {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {showAddEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-white/20 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Event</h3>
                            <button onClick={() => setShowAddEvent(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleAddEvent} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">Title</label>
                                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all" placeholder="e.g. Midterm Examination" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">Date & Time</label>
                                <input type="datetime-local" required value={newEvent.eventDate} onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-widest">Event Category</label>
                                <select value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white appearance-none cursor-pointer">
                                    <option value="TEST">🔥 Test / Exam</option>
                                    <option value="LESSON">📖 Lesson / Lecture</option>
                                    <option value="ASSIGNMENT">📝 Assignment Due</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all">Save Event Details</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
