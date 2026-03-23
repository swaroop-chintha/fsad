import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import Sidebar from '../components/Dashboard/Sidebar';
import StatsCards from '../components/Dashboard/StatsCards';
import AssignmentList from '../components/Dashboard/AssignmentList';
import SubmissionTable from '../components/Dashboard/SubmissionTable';
import { Plus, X, Award, Search, User, Lock, Mail, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import teacherBg from '../assets/teacher_bg.png';
import UpcomingEvents from '../components/Dashboard/UpcomingEvents';
import CourseMaterials from '../components/Dashboard/CourseMaterials';

import Toast from '../components/Toast';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const stompClient = useWebSocket();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalAssignments: 0,
        totalSubmissions: 0,
        pendingReviews: 0,
        gradedSubmissions: 0,
        upcomingDeadlines: 0
    });
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', maxMarks: '' });
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [viewingAssignmentId, setViewingAssignmentId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchStats();
        fetchCourses();
    }, []);

    // WebSocket Listeners
    useEffect(() => {
        if (stompClient && stompClient.connected) {
            const assignmentSub = stompClient.subscribe('/topic/assignments', (message) => {
                const type = message.body; // 'update' or 'delete'
                fetchStats();
                if (selectedCourse) fetchAssignments(selectedCourse.id);
                if (type === 'delete') showToast('Assignment deleted', 'info');
                else showToast('Assignment updated', 'info');
            });

            const submissionSub = stompClient.subscribe('/topic/submissions', (message) => {
                fetchStats();
                if (viewingAssignmentId) fetchSubmissions(viewingAssignmentId);
                showToast('New submission activity', 'info');
            });

            return () => {
                assignmentSub.unsubscribe();
                submissionSub.unsubscribe();
            };
        }
    }, [stompClient, selectedCourse, viewingAssignmentId]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/dashboard/teacher-stats');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats", err);
            showToast('Failed to load dashboard stats', 'error');
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get('/api/courses/my-courses');
            setCourses(res.data);
            if (res.data.length > 0 && !selectedCourse) {
                setSelectedCourse(res.data[0]);
                fetchAssignments(res.data[0].id);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
            showToast('Failed to load courses', 'error');
        }
    };

    const fetchAssignments = async (courseId) => {
        try {
            const res = await axios.get(`/api/assignments/course/${courseId}`);
            setAssignments(res.data);
        } catch (err) {
            console.error("Failed to fetch assignments", err);
            showToast('Failed to load assignments', 'error');
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const res = await axios.get(`/api/submissions/assignment/${assignmentId}`);
            setSubmissions(res.data);
        } catch (err) {
            console.error("Failed to fetch submissions", err);
            showToast('Failed to load submissions', 'error');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (!selectedCourse) {
            showToast('Please select a course first', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('courseId', selectedCourse.id);
        formData.append('title', newAssignment.title);
        formData.append('description', newAssignment.description);
        // Format date to ISO string without Z to match LocalDateTime.parse()
        // Input is yyyy-MM-ddTHH:mm, we ensure it sends yyyy-MM-ddTHH:mm:ss
        if (newAssignment.dueDate) {
            // If the input already has seconds, use it; otherwise append :00
            const formattedDate = newAssignment.dueDate.length === 16 ? `${newAssignment.dueDate}:00` : newAssignment.dueDate;
            formData.append('dueDate', formattedDate);
        }
        formData.append('maxMarks', newAssignment.maxMarks);
        if (assignmentFile) formData.append('file', assignmentFile);

        console.log("Creating Assignment with:", {
            courseId: selectedCourse.id,
            title: newAssignment.title,
            description: newAssignment.description,
            dueDate: formData.get('dueDate'),
            maxMarks: newAssignment.maxMarks
        });

        try {
            await axios.post('/api/assignments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowCreateAssignment(false);
            setNewAssignment({ title: '', description: '', dueDate: '', maxMarks: '' });
            setAssignmentFile(null);
            fetchStats(); // Update stats immediately
            fetchAssignments(selectedCourse.id);
            showToast('Assignment created successfully', 'success');
        } catch (err) {
            console.error("Failed to create assignment", err);
            showToast('Failed to create assignment', 'error');
        }
    };

    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/courses', newCourse);
            setCourses([...courses, res.data]);
            setSelectedCourse(res.data);
            setShowCreateCourse(false);
            setNewCourse({ title: '', description: '' });
            showToast('Course created successfully', 'success');
            // Refresh assignments for the new course (will be empty)
            fetchAssignments(res.data.id);
        } catch (err) {
            console.error("Failed to create course", err);
            showToast('Failed to create course', 'error');
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await axios.delete(`/api/assignments/${id}`);
                // UI updates handled by WebSocket
            } catch (err) {
                console.error("Failed to delete assignment", err);
                showToast('Failed to delete assignment', 'error');
            }
        }
    };

    const handleViewSubmissions = (assignmentId) => {
        setViewingAssignmentId(assignmentId);
        fetchSubmissions(assignmentId);
        setActiveTab('submissions');
    };

    const handleGrade = async (submissionId, marks, feedback) => {
        try {
            await axios.post(`/api/submissions/${submissionId}/grade`, null, {
                params: { marks, feedback }
            });
            showToast('Submission graded', 'success');
        } catch (err) {
            console.error("Failed to grade submission", err);
            showToast('Failed to grade submission', 'error');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />

            <div className="flex-1 ml-64 overflow-y-auto relative">
                {/* Background Image with Transparency Overlay */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-40"
                    style={{
                        backgroundImage: `url(${teacherBg})`
                    }}
                />

                {/* Content Container */}
                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'dashboard' && 'Dashboard Overview'}
                                {activeTab === 'courses' && 'My Courses'}
                                {activeTab === 'assignments' && 'Assignment Management'}
                                {activeTab === 'submissions' && 'Submission Review'}
                                {activeTab === 'settings' && 'Account Settings'}
                                {activeTab === 'help' && 'Help & Support'}
                            </h1>
                            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
                        </div>
                        {activeTab === 'assignments' && (
                            <button
                                onClick={() => setShowCreateAssignment(true)}
                                disabled={courses.length === 0}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${courses.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                            >
                                <Plus className="h-5 w-5" />
                                <span>Create Assignment</span>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    {activeTab === 'dashboard' && (
                        <>
                            <StatsCards stats={stats} />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                    <p className="text-gray-500 text-sm">Real-time updates will appear here...</p>
                                    {/* Placeholder for activity log if needed */}
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Active Courses</span>
                                            <span className="font-medium text-gray-900">{courses.length}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'assignments' && (
                        <>
                            <div className="mb-6 flex space-x-2 overflow-x-auto pb-2 items-center">
                                {courses.map(course => (
                                    <button
                                        key={course.id}
                                        onClick={() => {
                                            setSelectedCourse(course);
                                            fetchAssignments(course.id);
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCourse?.id === course.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {course.title}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowCreateCourse(true)}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> New Course
                                </button>
                            </div>

                            <AssignmentList
                                assignments={assignments}
                                onDelete={handleDeleteAssignment}
                                onViewSubmissions={handleViewSubmissions}
                            />

                            {selectedCourse && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                    <CourseMaterials courseId={selectedCourse.id} isTeacher={true} />
                                    <UpcomingEvents courseId={selectedCourse.id} isTeacher={true} />
                                </div>
                            )}

                            {showCreateAssignment && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-900">Create New Assignment</h3>
                                            <button onClick={() => setShowCreateAssignment(false)} className="text-gray-400 hover:text-gray-500">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                <input type="text" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                                    value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2" rows="3"
                                                    value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                                    <input type="datetime-local" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                                        value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                                                    <input type="number" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                                        value={newAssignment.maxMarks} onChange={e => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                                                <input type="file" onChange={e => setAssignmentFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button type="button" onClick={() => setShowCreateAssignment(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Create Assignment</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {showCreateCourse && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-900">Create New Course</h3>
                                            <button onClick={() => setShowCreateCourse(false)} className="text-gray-400 hover:text-gray-500">
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <form onSubmit={handleCreateCourse} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                                <input type="text" required className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2"
                                                    value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2" rows="3"
                                                    value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button type="button" onClick={() => setShowCreateCourse(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Create Course</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'submissions' && (
                        <>
                            {viewingAssignmentId ? (
                                <div>
                                    <button
                                        onClick={() => setActiveTab('assignments')}
                                        className="mb-4 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        &larr; Back to Assignments
                                    </button>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                                        Submissions for {assignments.find(a => a.id === viewingAssignmentId)?.title || 'Assignment'}
                                    </h2>
                                    <SubmissionTable submissions={submissions} onGrade={handleGrade} />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Select an assignment to view submissions.</p>
                                    <button
                                        onClick={() => setActiveTab('assignments')}
                                        className="mt-4 text-indigo-600 hover:underline"
                                    >
                                        Go to Assignments
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Your Created Courses</h2>
                                <button
                                    onClick={() => setShowCreateCourse(true)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>New Course</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => (
                                    <div key={course.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                            <button
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    fetchAssignments(course.id);
                                                    setActiveTab('assignments');
                                                }}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                View Assignments &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {courses.length === 0 && (
                                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                                        <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                                        <button onClick={() => setShowCreateCourse(true)} className="text-indigo-600 hover:text-indigo-700 font-medium">Create your first course</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center space-x-6">
                                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold border-4 border-white shadow-md">
                                        {user?.name?.charAt(0) || 'T'}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                                        <p className="text-indigo-600 font-medium mt-1 flex items-center bg-indigo-50 inline-flex px-3 py-1 rounded-full text-sm">
                                            <User className="h-4 w-4 mr-1.5" /> Teacher Account
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input type="text" disabled defaultValue={user?.name} className="bg-gray-50 pl-11 w-full border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-gray-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input type="email" disabled defaultValue={user?.email || 'teacher@edusub.com'} className="bg-gray-50 pl-11 w-full border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                                    <p className="text-sm text-gray-500 mb-4">Update your password and secure your account.</p>
                                    <button className="flex items-center space-x-2 text-indigo-600 font-medium px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
                                        <Lock className="h-4 w-4" />
                                        <span>Reset Password</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="max-w-4xl space-y-8">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-10 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10 w-full md:w-2/3">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">How can we help?</h2>
                                    <p className="text-indigo-100 text-lg mb-8">Search our knowledge base or browse frequently asked questions below to find answers quickly.</p>
                                    <div className="relative shadow-md rounded-xl">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input type="text" placeholder="Search for answers..." className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                    <HelpCircle className="h-64 w-64" />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                                            <HelpCircle className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {[
                                        { q: "How do I create a new course?", a: "Navigate to the Courses tab and click the 'New Course' button in the top right. Fill in the title and description, then save to start adding assignments." },
                                        { q: "Can students see assignments immediately after creation?", a: "Yes, once an assignment is created within a course, any student enrolled in the platform can view and submit it." },
                                        { q: "How do I grade a submission?", a: "Go to the Submissions tab, select an assignment, and you will see a list of student submissions. Click 'Grade', enter the marks and optional feedback, and save." }
                                    ].map((faq, i) => (
                                        <div key={i} className="p-8 hover:bg-gray-50/50 transition-colors">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">{faq.q}</h4>
                                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
