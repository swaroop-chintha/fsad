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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="mr-2 text-indigo-600 h-5 w-5" /> Upcoming
                </h3>
                {isTeacher && courseId && (
                    <button onClick={() => setShowAddEvent(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {events.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events scheduled.</p>
                ) : (
                    events.map(ev => {
                        const d = new Date(ev.eventDate);
                        return (
                            <div key={ev.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-2 text-center min-w-[60px]">
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{d.getDate()}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">{d.toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{ev.title}</h4>
                                    <div className="flex items-center text-sm mt-1">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${ev.eventType === 'TEST' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <span className={ev.eventType === 'TEST' ? 'text-red-500' : 'text-green-500'}>{ev.eventType}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {showAddEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-bold">Add Event</h3>
                            <button onClick={() => setShowAddEvent(false)}><X className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="mt-1 w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="datetime-local" required value={newEvent.eventDate} onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })} className="mt-1 w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })} className="mt-1 w-full border rounded-lg p-2 text-gray-700">
                                    <option value="TEST">Test / Exam</option>
                                    <option value="LESSON">Lesson</option>
                                    <option value="ASSIGNMENT">Assignment</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700">Save Event</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
