import React, { useState } from 'react';
import { X, Calendar, Clock, AlignLeft, Type } from 'lucide-react';

const EventFormModal = ({ onClose, onSubmit, isTeacher = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            console.error('Failed to create event', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/80 w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]"></div>
                    <div className="relative flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {isTeacher ? 'Create Global Event' : 'Add Personal Event'}
                            </h3>
                            <p className="text-indigo-200 text-sm mt-0.5">
                                {isTeacher
                                    ? 'Visible to all students'
                                    : 'Only visible to you'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <Type size={14} className="text-indigo-500" />
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Study Group, Exam Prep..."
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                            <AlignLeft size={14} className="text-indigo-500" />
                            Description
                            <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            placeholder="Add notes or details..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800 placeholder:text-gray-400 resize-none"
                        />
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                                <Calendar size={14} className="text-indigo-500" />
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.eventDate}
                                onChange={(e) => handleChange('eventDate', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                                <Clock size={14} className="text-indigo-500" />
                                Time
                                <span className="text-gray-400 font-normal">(opt)</span>
                            </label>
                            <input
                                type="time"
                                value={formData.eventTime}
                                onChange={(e) => handleChange('eventTime', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;
