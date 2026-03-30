import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Keeping auth context
import { BookOpen, CheckSquare, FileText, Bell, Calendar as CalendarIcon } from 'lucide-react';

// Components
// Components
import StatCard from '../components/StatCard';
import CalendarWidget from '../components/CalendarWidget';
import CourseList from '../components/CourseList';
import CourseAssignmentsView from '../components/CourseAssignmentsView';
import UpcomingEvents from '../components/Dashboard/UpcomingEvents';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [allUpcomingEvents, setAllUpcomingEvents] = useState([]);
    const [stats, setStats] = useState({
        lessons: { total: 0, completed: 0, progress: 0 },
        assignments: { total: 0, completed: 0, progress: 0 },
        tests: { total: 0, completed: 0, progress: 0 }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Fetch Courses
            const coursesRes = await axios.get('/api/courses');
            console.log("Fetched courses:", coursesRes.data); // Debug logging
            const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : [];

            // 2. Fetch My Submissions
            const subRes = await axios.get('/api/submissions/my-submissions');
            const mySubmissions = subRes.data;

            // 3. Fetch Assignments for ALL courses (to calculate progress)
            const coursesWithDetails = await Promise.all(coursesData.map(async (course) => {
                try {
                    const assignRes = await axios.get(`/api/assignments/course/${course.id}`);
                    const courseAssignments = assignRes.data;

                    // Calculate progress
                    const courseSubmissions = mySubmissions.filter(sub =>
                        courseAssignments.some(assign => assign.id === sub.assignment.id)
                    );

                    const progress = courseAssignments.length > 0
                        ? Math.round((courseSubmissions.length / courseAssignments.length) * 100)
                        : 0;

                    // Fetch Events
                    let courseEvents = [];
                    try {
                        const eventsRes = await axios.get(`/api/events/course/${course.id}`);
                        courseEvents = eventsRes.data;
                    } catch (e) { console.error("Failed to fetch events", e); }

                    return {
                        ...course,
                        assignments: courseAssignments,
                        progress: progress,
                        submissions: courseSubmissions,
                        events: courseEvents
                    };
                } catch (e) {
                    console.error(`Failed to fetch assignments for course ${course.id}`, e);
                    return { ...course, assignments: [], progress: 0, submissions: [], events: [] };
                }
            }));

            setCourses(coursesWithDetails);

            // Aggregate Global Stats
            const allAssignments = coursesWithDetails.flatMap(c => c.assignments);
            const totalAssignments = allAssignments.length;
            const completedAssignments = mySubmissions.length;
            const globalEvents = coursesWithDetails.flatMap(c => c.events).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

            setAssignments(allAssignments); // Store all assignments
            setAllUpcomingEvents(globalEvents);

            // Stats State
            setStats({
                lessons: { total: coursesWithDetails.length * 5, completed: Math.round(coursesWithDetails.length * 2.5), progress: 50 }, // Mock lessons for now
                assignments: {
                    total: totalAssignments,
                    completed: completedAssignments,
                    progress: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0
                },
                tests: { total: 0, completed: 0, progress: 0 } // No tests yet
            });

        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 -z-10 rounded-[3rem]"></div>
            
            {selectedCourse && (
                <CourseAssignmentsView
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    onRefresh={fetchData}
                />
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                <StatCard
                    icon={BookOpen}
                    label="Lessons"
                    value={stats.lessons.completed.toString()}
                    subLabel={`of ${stats.lessons.total} completed`}
                    progress={stats.lessons.progress}
                    color="bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-orange-500/20"
                />
                <StatCard
                    icon={CheckSquare}
                    label="Assignments"
                    value={stats.assignments.completed.toString()}
                    subLabel={`of ${stats.assignments.total} completed`}
                    progress={stats.assignments.progress}
                    color="bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-rose-500/20"
                />
                <StatCard
                    icon={FileText}
                    label="Tests"
                    value={stats.tests.completed.toString()}
                    subLabel={`of ${stats.tests.total} completed`}
                    progress={stats.tests.progress}
                    color="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-500/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Courses) */}
                <div className="lg:col-span-2 space-y-8 relative z-10">
                    {isLoading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-48 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white"></div>
                            <div className="space-y-4">
                                <div className="h-24 bg-white/60 backdrop-blur-md rounded-2xl border border-white"></div>
                                <div className="h-24 bg-white/60 backdrop-blur-md rounded-2xl border border-white"></div>
                            </div>
                        </div>
                    ) : (
                        <CourseList courses={courses} onSelectCourse={handleSelectCourse} />
                    )}
                </div>

                {/* Right Column (Calendar & Upcoming) */}
                <div className="space-y-8">
                    <CalendarWidget />

                    {/* Upcoming List */}
                    <UpcomingEvents eventsProp={allUpcomingEvents} isTeacher={false} />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
