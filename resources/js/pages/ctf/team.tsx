import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { CheckCircle2, Flag, Medal, Trophy, User, Users } from 'lucide-react';
import { CTFLayout } from '@/layouts/ctf-layout';
import { CategoryBadge } from '@/components/category-badge';
import { ScoreBadge } from '@/components/score-badge';
import { StatCard } from '@/components/stat-card';
import { mockChallenges, mockCurrentTeam, mockTeamMembers, mockScoreboard } from '@/lib/mock-data';

export default function CTFTeam() {
    const team = mockCurrentTeam;
    const members = mockTeamMembers;
    const teamRank = mockScoreboard.find((s) => s.teamId === team.id)?.rank || 0;

    // Get solved challenges
    const solvedChallenges = mockChallenges.filter((c) => c.isSolved && c.isPublished);
    const totalPossibleScore = mockChallenges
        .filter((c) => c.isPublished)
        .reduce((sum, c) => sum + c.score, 0);

    return (
        <CTFLayout title="Team" currentPath="/ctf/team">
            {/* Team Header */}
            <div className="mb-8 rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{team.name}</h1>
                            <p className="text-muted-foreground">
                                Team Code: <code className="text-primary">{team.code}</code>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={clsx(
                                'flex items-center gap-2 rounded-lg border px-4 py-2',
                                teamRank === 1 && 'border-yellow-500/50 bg-yellow-500/10',
                                teamRank === 2 && 'border-gray-400/50 bg-gray-400/10',
                                teamRank === 3 && 'border-orange-600/50 bg-orange-600/10',
                                teamRank > 3 && 'border-border bg-secondary',
                            )}
                        >
                            <Medal
                                className={clsx(
                                    'h-5 w-5',
                                    teamRank === 1 && 'text-yellow-400',
                                    teamRank === 2 && 'text-gray-300',
                                    teamRank === 3 && 'text-orange-400',
                                    teamRank > 3 && 'text-muted-foreground',
                                )}
                            />
                            <span className="font-bold">Rank #{teamRank}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Score"
                    value={team.totalScore}
                    icon={Trophy}
                    description={`${((team.totalScore / totalPossibleScore) * 100).toFixed(1)}% of total`}
                />
                <StatCard
                    title="Challenges Solved"
                    value={solvedChallenges.length}
                    icon={Flag}
                    description={`out of ${mockChallenges.filter((c) => c.isPublished).length} challenges`}
                />
                <StatCard
                    title="Team Rank"
                    value={`#${teamRank}`}
                    icon={Medal}
                    description={`out of ${mockScoreboard.length} teams`}
                />
                <StatCard
                    title="Team Members"
                    value={members.length}
                    icon={Users}
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Team Members */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Team Members</h2>
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{member.username}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Solved Challenges */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Solved Challenges</h2>
                    {solvedChallenges.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Flag className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                No challenges solved yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {solvedChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/5 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="font-medium">{challenge.title}</p>
                                            <CategoryBadge
                                                category={challenge.category}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    <ScoreBadge score={challenge.score} size="sm" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
                <div className="space-y-3">
                    {solvedChallenges.slice(0, 5).map((challenge, index) => (
                        <div
                            key={challenge.id}
                            className="flex items-center gap-4 border-l-2 border-green-500 pl-4"
                        >
                            <div className="flex-1">
                                <p className="text-sm">
                                    <span className="font-medium text-green-400">Solved</span>{' '}
                                    <span className="font-semibold">{challenge.title}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    +{challenge.score} points
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {dayjs().subtract(index * 30, 'minute').fromNow()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </CTFLayout>
    );
}
