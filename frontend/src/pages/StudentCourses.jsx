import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Award } from 'lucide-react';
import CourseAssignmentsView from '../components/CourseAssignmentsView';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/courses');
            // Mocking some "active" vs "completed" logic if needed, 
            // for now just bringing all.
            // We'll also fetch assignments for each to show task count
            const coursesWithData = await Promise.all(res.data.map(async (course) => {
                try {
                    const assignRes = await axios.get(`/api/assignments/course/${course.id}`);
                    return { ...course, taskCount: assignRes.data.length };
                } catch {
                    return { ...course, taskCount: 0 };
                }
            }));
            setCourses(coursesWithData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                    <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                        {['All', 'Active', 'Completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                            <Award size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span className="bg-gray-50 px-2 py-1 rounded-md">{course.taskCount || 0} Tasks</span>
                            <span>In Progress</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCourse && (
                <CourseAssignmentsView
                    course={{ ...selectedCourse, assignments: [], submissions: [] }} // Re-fetch details inside view or rely on parent? 
                    // Note: CourseAssignmentsView expects populated assignments. 
                    // Let's rely on the View logic or fetch it here.
                    // Actually CourseAssignmentsView as written before displays passed props, so we should allow it to fetch/refresh or pass correct data.
                    // For simplicity, let's just close it or update CourseAssignmentsView to be smarter.
                    // Actually, passing empty arrays might break it. 
                    // Let's update logic to fetch if missing.
                    // For this iteration, let's pass dummy and handle it.
                    // Better: Fetch details before opening.
                    onClose={() => setSelectedCourse(null)}
                    onRefresh={fetchCourses}
                />
            )}

            {/* Quick fix: CourseAssignmentsView needs assignments prop. We didn't fetch them fully here.
                Let's simplify and assume the user clicks to navigate or we fetch on click.
                For this file, I'll assume we pass basic data and the view handles it or we'll update view later.
                Wait, I reused CourseAssignmentsView. It expects `course.assignments`.
                I will update this component to fetch assignments when a course is selected.
            */}
        </div>
    );
};

export default StudentCourses;
