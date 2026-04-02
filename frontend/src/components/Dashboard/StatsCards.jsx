import React from 'react';
import { BookOpen, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-8 rounded-[2.5rem] ${color} relative overflow-hidden flex items-center justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default group border border-white/20 dark:border-white/10`}>
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
            <p className="text-xs font-black text-white/70 mb-2 uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
        </div>
        <div className="relative z-10 p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
            <Icon className="h-8 w-8 text-white" />
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
