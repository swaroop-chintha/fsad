import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Clock, CheckCircle, AlertCircle, Award, Download, Paperclip } from 'lucide-react';
import CourseMaterials from './Dashboard/CourseMaterials';

const CourseAssignmentsView = ({ course, onClose, onRefresh }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                <Award size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
                        </div>
                        <p className="text-gray-500">{course.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <CourseMaterials courseId={course.id} isTeacher={false} />

                    <div className="flex items-center justify-between mt-8">
                        <h3 className="text-lg font-bold text-gray-800">Assignments & Tasks</h3>
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            {course.assignments.length} Tasks
                        </span>
                    </div>

                    {course.assignments.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No assignments posted for this course yet.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {course.assignments.map(assignment => {
                                // Find submission for this assignment
                                const submission = course.submissions.find(s => s.assignment.id === assignment.id);
                                return (
                                    <AssignmentItem
                                        key={assignment.id}
                                        assignment={assignment}
                                        submission={submission}
                                        onRefresh={onRefresh}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AssignmentItem = ({ assignment, submission, onRefresh }) => {
    const isLate = new Date() > new Date(assignment.dueDate);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleDownloadAttached = async (url) => {
        if (!url) return;
        try {
            const token = localStorage.getItem('token');
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            const downloadApiUrl = `/api/submissions/download/${fileName}`;
            
            const response = await fetch(downloadApiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading:', error);
            alert('Failed to download file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('assignmentId', assignment.id);
        formData.append('file', file);

        try {
            await axios.post('/api/submissions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
        } catch (err) {
            console.error(err);
            alert("Submission failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow bg-gray-50/50">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">{assignment.title}</h4>
                        {isLate && !submission && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertCircle size={10} /> Overdue
                            </span>
                        )}
                        {submission && (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle size={10} /> Submitted
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1 text-gray-400"><Clock size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-gray-400"><Award size={12} /> {assignment.maxMarks} Marks</span>
                        {assignment.fileUrl && (
                            <button 
                                onClick={() => handleDownloadAttached(assignment.fileUrl)}
                                className="flex items-center gap-2 hover:bg-indigo-100 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md transition-colors border border-indigo-100 font-bold"
                                title="Download Reference Material"
                            >
                                <Paperclip className="h-3 w-3" />
                                <span>Reference Attached</span>
                                <Download className="h-3 w-3 ml-1" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="md:w-72 bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-shrink-0">
                    {submission ? (
                        <div>
                            {submission.marks !== null ? (
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Grade</p>
                                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                                        {submission.marks}<span className="text-sm text-gray-400 font-normal">/{assignment.maxMarks}</span>
                                    </div>
                                    {submission.feedback && (
                                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                            "{submission.feedback}"
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-2">
                                        <Clock size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">Pending Grading</p>
                                    <p className="text-xs text-gray-400 mt-1">Your submission has been received.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Upload Work</label>
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files[0])}
                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-3"
                                required
                            />
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {uploading ? 'Uploading...' : <><Upload size={12} /> Submit Assignment</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseAssignmentsView;
