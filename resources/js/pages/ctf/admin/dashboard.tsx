import {
    CheckCircle2,
    FileText,
    Flag,
    TrendingUp,
    Users,
    UsersRound,
    XCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { StatCard } from '@/components/stat-card';
import { CategoryBadge } from '@/components/category-badge';
import { Countdown } from '@/components/countdown';
import { DashboardStats, Submission, Team, ScoreboardEntry } from '@/types/ctf';
 
dayjs.extend(relativeTime);


interface AdminDashboardProps {
    stats: DashboardStats;
    recentSubmissions: (Submission & { teamName: string; challengeTitle: string })[];
    topTeams: ScoreboardEntry[];
}

export default function AdminDashboard({ stats, recentSubmissions, topTeams }: AdminDashboardProps) {

    return (
        <CTFAdminLayout title="Dashboard" currentPath="/ctf/admin/dashboard">
            {/* Event Countdown */}
            <div className="mb-8 flex justify-center">
                <Countdown size="large" />
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Teams"
                    value={stats.totalTeams}
                    icon={UsersRound}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                />
                <StatCard
                    title="Challenges"
                    value={`${stats.publishedChallenges}/${stats.totalChallenges}`}
                    icon={Flag}
                    description="published"
                />
                <StatCard
                    title="Submissions"
                    value={stats.totalSubmissions}
                    icon={FileText}
                    description={`${stats.correctSubmissions} correct`}
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Submissions */}
                <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border p-4">
                        <h2 className="flex items-center gap-2 font-semibold">
                            <FileText className="h-5 w-5 text-primary" />
                            Recent Submissions
                        </h2>
                    </div>
                    <div className="divide-y divide-border">
                        {recentSubmissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    {submission.isCorrect ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    <div>
                                        <p className="font-medium">{submission.teamName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.challengeTitle}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {dayjs(submission.createdAt).fromNow()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Teams */}
                <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border p-4">
                        <h2 className="flex items-center gap-2 font-semibold">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Top Teams
                        </h2>
                    </div>
                    <div className="divide-y divide-border">
                        {topTeams.map((team, index) => (
                            <div
                                key={team.teamId}
                                className="flex items-center justify-between p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                            index === 0
                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                : index === 1
                                                  ? 'bg-gray-400/20 text-gray-300'
                                                  : index === 2
                                                    ? 'bg-orange-600/20 text-orange-400'
                                                    : 'bg-secondary text-muted-foreground'
                                        }`}
                                    >
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium">{team.teamName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {team.solvedCount} solved
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-primary">
                                    {team.totalScore} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Correct Rate</p>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-green-400">
                        {stats.totalSubmissions > 0
                            ? ((stats.correctSubmissions / stats.totalSubmissions) * 100).toFixed(1)
                            : '0.0'}%
                    </p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Avg Score per Team</p>
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-primary">
                        {stats.averageScore || 0}
                    </p>
                </div>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Avg Users per Team</p>
                        <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-blue-400">
                        {stats.totalTeams > 0 ? (stats.totalUsers / stats.totalTeams).toFixed(1) : '0'}
                    </p>
                </div>
            </div>
        </CTFAdminLayout>
    );
}
