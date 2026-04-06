import React from 'react';
import { Edit, Trash2, Calendar, FileText, Download, Paperclip } from 'lucide-react';

const AssignmentList = ({ assignments, onDelete, onViewSubmissions }) => {
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

    if (!assignments || assignments.length === 0) {
        return (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] shadow-sm p-12 text-center border border-white dark:border-gray-700">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Assignments Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">Create your first assignment to start tracking student progress.</p>
            </div>
        );
    }

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white dark:border-gray-700 overflow-hidden transition-all duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Assignments</h2>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {assignments.length} Total
                </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-8 hover:bg-white/40 dark:hover:bg-gray-700/30 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{assignment.description}</p>
                                <div className="flex items-center flex-wrap gap-4 text-xs font-semibold">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                        Due: {new Date(assignment.dueDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                        {assignment.maxMarks} Points Possible
                                    </span>
                                    {assignment.fileUrl && (
                                        <button 
                                            onClick={() => handleDownloadAttached(assignment.fileUrl)}
                                            className="flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800/50"
                                            title="Download Reference Material"
                                        >
                                            <Paperclip className="h-3.5 w-3.5" />
                                            <span>Reference Attached</span>
                                            <Download className="h-3.5 w-3.5 ml-1" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                <button
                                    onClick={() => onViewSubmissions(assignment.id)}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-bold text-sm active:scale-95"
                                >
                                    View Submissions
                                </button>
                                <button
                                    onClick={() => onDelete(assignment.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                                    title="Delete Assignment"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignmentList;
