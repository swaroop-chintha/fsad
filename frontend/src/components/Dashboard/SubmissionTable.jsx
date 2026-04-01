import React, { useState } from 'react';
import { Download, Save, Check } from 'lucide-react';

const SubmissionTable = ({ submissions, onGrade }) => {
    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 mt-6">
                <p className="text-gray-500">No submissions found for this assignment.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks & Feedback</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
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
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{submission.student?.name}</div>
                <div className="text-sm text-gray-500">{submission.student?.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(submission.submissionDate).toLocaleString()}
                {submission.status === 'LATE' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Late
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {submission.fileUrl ? (
                    <button
                        onClick={handleDownload}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 focus:outline-none bg-transparent border-0 cursor-pointer"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                    </button>
                ) : (
                    <span className="text-gray-400">No file</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${submission.status === 'GRADED'
                    ? 'bg-green-100 text-green-800'
                    : submission.status === 'LATE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {submission.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {isEditing ? (
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="Marks"
                            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Feedback"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <button
                                onClick={handleSave}
                                className="p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                <Save className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-start group">
                        <div className="space-y-1">
                            <div className="font-medium text-gray-900">{submission.marks} Marks</div>
                            <div className="text-gray-500 italic truncate max-w-xs">{submission.feedback}</div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-900 text-xs"
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
