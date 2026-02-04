import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircle2, Filter, Search, XCircle } from 'lucide-react';
import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { CategoryBadge } from '@/components/category-badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { mockSubmissions, mockTeams, mockChallenges } from '@/lib/mock-data';

dayjs.extend(relativeTime);

export default function AdminSubmissions() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTeam, setFilterTeam] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'correct' | 'incorrect'>('all');

    const sortedSubmissions = [...mockSubmissions].reverse();

    const filteredSubmissions = useMemo(() => {
        return sortedSubmissions.filter((submission) => {
            const matchesSearch =
                submission.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                submission.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTeam =
                filterTeam === 'all' || submission.teamId.toString() === filterTeam;
            const matchesStatus =
                filterStatus === 'all' ||
                (filterStatus === 'correct' && submission.isCorrect) ||
                (filterStatus === 'incorrect' && !submission.isCorrect);
            return matchesSearch && matchesTeam && matchesStatus;
        });
    }, [sortedSubmissions, searchQuery, filterTeam, filterStatus]);

    const stats = {
        total: mockSubmissions.length,
        correct: mockSubmissions.filter((s) => s.isCorrect).length,
        incorrect: mockSubmissions.filter((s) => !s.isCorrect).length,
    };

    return (
        <CTFAdminLayout title="Submission Log" currentPath="/ctf/admin/submissions">
            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <p className="text-sm text-green-400">Correct</p>
                    <p className="text-2xl font-bold text-green-400">{stats.correct}</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                    <p className="text-sm text-red-400">Incorrect</p>
                    <p className="text-2xl font-bold text-red-400">{stats.incorrect}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by team or challenge..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterTeam} onValueChange={setFilterTeam}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Team" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Teams</SelectItem>
                        {mockTeams.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filterStatus}
                    onValueChange={(v) => setFilterStatus(v as 'all' | 'correct' | 'incorrect')}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="correct">Correct</SelectItem>
                        <SelectItem value="incorrect">Incorrect</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Submissions Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Team
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Challenge
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredSubmissions.map((submission) => {
                                const challenge = mockChallenges.find(
                                    (c) => c.id === submission.challengeId,
                                );
                                return (
                                    <tr
                                        key={submission.id}
                                        className={clsx(
                                            'transition-colors hover:bg-secondary/30',
                                            submission.isCorrect
                                                ? 'bg-green-500/5'
                                                : 'bg-red-500/5',
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            {submission.isCorrect ? (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    <span className="font-medium">Correct</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <XCircle className="h-5 w-5" />
                                                    <span className="font-medium">Wrong</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{submission.teamName}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {submission.challengeTitle}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {challenge && (
                                                <CategoryBadge
                                                    category={challenge.category}
                                                    size="sm"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm">
                                                    {dayjs(submission.createdAt).format(
                                                        'MMM D, YYYY HH:mm',
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {dayjs(submission.createdAt).fromNow()}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredSubmissions.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <Filter className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No submissions found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}
        </CTFAdminLayout>
    );
}
