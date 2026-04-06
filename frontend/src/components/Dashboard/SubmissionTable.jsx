import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, FileText, Check, MessageSquare } from 'lucide-react';

const SubmissionTable = ({ submissions, onGrade }) => {
    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] shadow-sm p-12 text-center border border-white dark:border-gray-700 mt-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No submissions found for this assignment yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white dark:border-gray-700 overflow-hidden mt-8 transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                    <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted Date</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Attachment</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Status</th>
                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grading & Feedback</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {submissions.map((submission) => (
                            <SubmissionRow key={submission.id} submission={submission} onGrade={onGrade} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SubmissionRow = ({ submission, onGrade }) => {
    const [marks, setMarks] = useState(submission.marks || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [isEditing, setIsEditing] = useState(!submission.marks);

    const handleSave = () => {
        onGrade(submission.id, marks, feedback);
        setIsEditing(false);
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
            const url = `${baseUrl}/api/submissions/download/${submission.fileUrl}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Download failed');
            }
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = submission.fileUrl;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    return (
        <tr className="hover:bg-white/40 dark:hover:bg-gray-700/30 transition-colors group">
            <td className="px-8 py-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {submission.student?.name?.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{submission.student?.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{submission.student?.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                {new Date(submission.submissionDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                {submission.status === 'LATE' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                        Late
                    </span>
                )}
            </td>
            <td className="px-8 py-6 whitespace-nowrap text-sm">
                {submission.fileUrl ? (
                    <button
                        onClick={handleDownload}
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition-colors group/btn"
                    >
                        <Download className="h-4 w-4 mr-2 group-hover/btn:translate-y-0.5 transition-transform" />
                        Download PDF
                    </button>
                ) : (
                    <span className="text-gray-400 dark:text-gray-600 italic">No attachment</span>
                )}
            </td>
            <td className="px-8 py-6 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black uppercase rounded-full tracking-wider border ${submission.status === 'GRADED'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                    : submission.status === 'LATE'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800'
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                    }`}>
                    {submission.status}
                </span>
            </td>
            <td className="px-8 py-6 whitespace-nowrap text-sm">
                {isEditing ? (
                    <div className="flex items-center gap-3 animate-fade-in">
                        <div className="relative max-w-[100px]">
                            <input
                                type="number"
                                placeholder="Marks"
                                className="block w-full bg-gray-50 dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold p-2.5 dark:text-white"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Feedback"
                                className="block w-full bg-gray-50 dark:bg-gray-900 rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium p-2.5 dark:text-white min-w-[200px]"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <button
                                onClick={handleSave}
                                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                title="Save Grade"
                            >
                                <Check className="h-5 w-5 font-bold" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center group/grade min-h-[44px]">
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg font-black text-sm border border-indigo-100 dark:border-indigo-800">
                                {submission.marks} / {submission.assignment?.maxMarks || 20}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 italic text-xs max-w-[200px] truncate font-medium">
                                "{submission.feedback || 'No feedback provided'}"
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default SubmissionTable;
