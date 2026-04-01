import React from 'react';
import { PlayCircle, Award, Clock, Inbox } from 'lucide-react';

const CourseList = ({ courses, onSelectCourse }) => {
    // For demo purposes, assume the first course is "active"
    const activeCourse = courses.length > 0 ? courses[0] : null;
    const otherCourses = courses.length > 1 ? courses.slice(1) : [];

    if (!activeCourse) return (
        <div className="flex flex-col items-center justify-center p-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] border border-white dark:border-gray-700 text-center shadow-lg shadow-indigo-500/5 transition-colors duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-indigo-400 mb-6 shadow-inner ring-4 ring-white dark:ring-gray-700">
                <Inbox size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">No Courses Yet</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm font-medium">It looks like you aren't enrolled in any courses right now. Check back later or contact your teacher!</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Active Course Banner */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{activeCourse.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{activeCourse.description}</p>

                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1"><PlayingIcon /> 12 Lessons</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> 6h 30m</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex-1 md:w-48">
                        <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                            <span>Progress</span>
                            <span>{activeCourse.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${activeCourse.progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <button
                        onClick={() => onSelectCourse(activeCourse)}
                        className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <PlayCircle size={18} />
                        Resume
                    </button>
                </div>
            </div>

            {/* Other Courses */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">My Courses</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm">Active</button>
                        <button className="px-4 py-1.5 rounded-lg text-gray-400 dark:text-gray-500 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Completed</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {otherCourses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-all cursor-pointer" onClick={() => onSelectCourse(course)}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500 dark:text-orange-400">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">{course.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{course.description}</p>
                                </div>
                            </div>

                            <div className="w-32 hidden md:block">
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {otherCourses.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No other active courses.</p>}
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const PlayingIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5v-15c0-.9.6-1.55 1.5-1.5s1.5.65 1.5 1.5v15c0 .9-.6 1.55-1.5 1.5S4 20.4 4 19.5zm6 2.25c.9 0 1.5-.65 1.5-1.5v-10c0-.9-.6-1.55-1.5-1.5s-1.5.65-1.5 1.5v10c0 .9.6 1.55 1.5 1.5zm6-5c.9 0 1.5-.65 1.5-1.5v-6.5c0-.9-.6-1.55-1.5-1.5s-1.5.65-1.5 1.5v6.5c0 .9.6 1.55 1.5 1.5z" />
    </svg>
);

export default CourseList;
