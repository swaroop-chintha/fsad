import React, { useState } from 'react';
import { Edit, Trash2, Calendar, FileText } from 'lucide-react';

const AssignmentList = ({ assignments, onDelete, onViewSubmissions }) => {
    if (!assignments || assignments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Assignments Yet</h3>
                <p className="text-gray-500 mt-1">Create your first assignment to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Assignments</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900 mb-1">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{assignment.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Due: {new Date(assignment.dueDate).toLocaleString()}
                                    </div>
                                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">
                                        {assignment.maxMarks} Marks
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => onViewSubmissions(assignment.id)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                                >
                                    Submissions
                                </button>
                                <button
                                    onClick={() => onDelete(assignment.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Assignment"
                                >
                                    <Trash2 className="h-4 w-4" />
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
