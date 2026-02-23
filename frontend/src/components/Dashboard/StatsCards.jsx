import React from 'react';
import { BookOpen, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Assignments"
                value={stats.totalAssignments}
                icon={BookOpen}
                color="bg-blue-500"
            />
            <StatCard
                title="Total Submissions"
                value={stats.totalSubmissions}
                icon={FileText}
                color="bg-indigo-500"
            />
            <StatCard
                title="Pending Reviews"
                value={stats.pendingReviews}
                icon={AlertCircle}
                color="bg-amber-500"
            />
            <StatCard
                title="Graded"
                value={stats.gradedSubmissions}
                icon={CheckCircle}
                color="bg-green-500"
            />
        </div>
    );
};

export default StatsCards;
