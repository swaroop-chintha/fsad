import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Award } from 'lucide-react';
import CourseAssignmentsView from '../components/CourseAssignmentsView';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            // Fetch courses
            const res = await api.get('/api/courses');
            
            // Fetch my submissions to sync State
            let mySubmissions = [];
            try {
                const subRes = await api.get('/api/submissions/my-submissions');
                mySubmissions = subRes.data || [];
            } catch (err) {
                console.warn("Could not fetch submissions overlay", err);
            }

            // Bind assignments and matched submissions to each course
            const coursesWithData = await Promise.all(res.data.map(async (course) => {
                try {
                    const assignRes = await api.get(`/api/assignments/course/${course.id}`);
                    const courseAssignments = assignRes.data || [];
                    
                    const courseSubmissions = mySubmissions.filter(sub => 
                        courseAssignments.some(assign => assign.id === sub.assignment.id)
                    );

                    return { 
                        ...course, 
                        taskCount: courseAssignments.length,
                        assignments: courseAssignments,
                        submissions: courseSubmissions
                    };
                } catch {
                    return { ...course, taskCount: 0, assignments: [], submissions: [] };
                }
            }));
            
            setCourses(coursesWithData);
            
            // If a course is currently selected, update its reference to reflect new submissions
            if (selectedCourse) {
                const updatedCourse = coursesWithData.find(c => c.id === selectedCourse.id);
                if (updatedCourse) setSelectedCourse(updatedCourse);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Simple client-side filtering mock
    const filteredCourses = courses.filter(c => {
        if (filter === 'All') return true;
        if (filter === 'Active') return c.taskCount > 0;
        if (filter === 'Completed') return c.taskCount === 0;
        return true;
    });

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

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
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
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{course.taskCount || 0} Tasks</span>
                                <span>{course.taskCount > 0 ? 'In Progress' : 'Browse'}</span>
                            </div>
                        </div>
                    ))}
                    {filteredCourses.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            No courses found matching this view.
                        </div>
                    )}
                </div>
            )}

            {selectedCourse && (
                <CourseAssignmentsView
                    course={selectedCourse} 
                    onClose={() => setSelectedCourse(null)}
                    onRefresh={fetchCourses}
                />
            )}
        </div>
    );
};

export default StudentCourses;
