import React from 'react';
import { PlayCircle, Award, Clock } from 'lucide-react';

const CourseList = ({ courses, onSelectCourse }) => {
    // For demo purposes, assume the first course is "active"
    const activeCourse = courses.length > 0 ? courses[0] : null;
    const otherCourses = courses.length > 1 ? courses.slice(1) : [];

    if (!activeCourse) return <div className="text-gray-500">No courses enrolled yet.</div>;

    return (
        <div className="space-y-8">
            {/* Active Course Banner */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{activeCourse.title}</h3>
                        <p className="text-gray-500 text-sm">{activeCourse.description}</p>

                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><PlayingIcon /> 12 Lessons</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> 6h 30m</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex-1 md:w-48">
                        <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                            <span>Progress</span>
                            <span>{activeCourse.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${activeCourse.progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <button
                        onClick={() => onSelectCourse(activeCourse)}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <PlayCircle size={18} />
                        Resume
                    </button>
                </div>
            </div>

            {/* Other Courses */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">My Courses</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-sm">Active</button>
                        <button className="px-4 py-1.5 rounded-lg text-gray-400 font-medium text-sm hover:bg-gray-50">Completed</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {otherCourses.map(course => (
                        <div key={course.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectCourse(course)}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{course.title}</h4>
                                    <p className="text-xs text-gray-500">{course.description}</p>
                                </div>
                            </div>

                            <div className="w-32 hidden md:block">
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {otherCourses.length === 0 && <p className="text-gray-400 text-sm">No other active courses.</p>}
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
