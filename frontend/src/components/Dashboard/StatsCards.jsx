import React from 'react';
import { BookOpen, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-[2rem] ${color} relative overflow-hidden flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default group`}>
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full mix-blend-overlay filter blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500"></div>
        <div>
            <p className="text-sm font-bold text-white/80 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20`}>
            <Icon className="h-7 w-7 text-white" />
        </div>
    </div>
);

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
            <StatCard
                title="Assignments"
                value={stats.totalAssignments}
                icon={BookOpen}
                color="bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-500/20"
            />
            <StatCard
                title="Submissions"
                value={stats.totalSubmissions}
                icon={FileText}
                color="bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/20"
            />
            <StatCard
                title="Pending Review"
                value={stats.pendingReviews}
                icon={AlertCircle}
                color="bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/20"
            />
            <StatCard
                title="Graded"
                value={stats.gradedSubmissions}
                icon={CheckCircle}
                color="bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/20"
            />
        </div>
    );
};

export default StatsCards;
