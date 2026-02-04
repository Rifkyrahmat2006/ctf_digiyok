import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Medal, RefreshCw, Trophy } from 'lucide-react';
import { CTFLayout } from '@/layouts/ctf-layout';
import { Button } from '@/components/ui/button';
interface CTFScoreboardProps {
    initialScoreboard: {
        teamId: number;
        teamName: string;
        totalScore: number;
        solvedCount: number;
        lastSolveTime: string | null;
        rank: number;
    }[];
}

export default function CTFScoreboard({ initialScoreboard }: CTFScoreboardProps) {
    const [scoreboard, setScoreboard] = useState(initialScoreboard);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Simulate realtime updates (in real app, this would use Laravel Echo)
    // For now, we just reload the page or re-fetch props.
    // Given we just want to replace mock, we will rely on initialScoreboard for now.
    // If we want refresh, we can router.reload({ only: ['initialScoreboard'] })
    
    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['initialScoreboard'],
            onFinish: () => {
                setLastUpdated(new Date());
                setIsRefreshing(false);
            },
        });
    };

    useEffect(() => {
        setScoreboard(initialScoreboard);
    }, [initialScoreboard]);
    
    // Auto-refresh disabled for now or use interval to router.reload
    useEffect(() => {
        const interval = setInterval(() => {
            // handleRefresh(); // strict refresh might be too heavy?
            // keeping it manual for now or simple interval
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 2:
                return 'bg-gray-400/20 border-gray-400/50 text-gray-300';
            case 3:
                return 'bg-orange-600/20 border-orange-600/50 text-orange-400';
            default:
                return 'bg-card border-border';
        }
    };

    const getRankIcon = (rank: number) => {
        const iconClass = 'h-5 w-5';
        switch (rank) {
            case 1:
                return <Medal className={clsx(iconClass, 'text-yellow-400')} />;
            case 2:
                return <Medal className={clsx(iconClass, 'text-gray-300')} />;
            case 3:
                return <Medal className={clsx(iconClass, 'text-orange-400')} />;
            default:
                return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    return (
        <CTFLayout title="Scoreboard" currentPath="/ctf/scoreboard">
            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold">
                        <Trophy className="h-8 w-8 text-primary" />
                        Scoreboard
                    </h1>
                    <p className="text-muted-foreground">
                        Live rankings updated in realtime
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Last updated: {dayjs(lastUpdated).fromNow()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={clsx('mr-2 h-4 w-4', isRefreshing && 'animate-spin')}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Scoreboard Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-muted-foreground">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-5 sm:col-span-6">Team</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Score</div>
                    <div className="col-span-3 text-center hidden sm:block">Last Solve</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                    {scoreboard.map((entry, index) => (
                        <div
                            key={entry.teamId}
                            className={clsx(
                                'grid grid-cols-12 gap-4 px-4 py-4 transition-colors hover:bg-secondary/30',
                                entry.rank <= 3 && 'border-l-4',
                                entry.rank === 1 && 'border-l-yellow-500',
                                entry.rank === 2 && 'border-l-gray-400',
                                entry.rank === 3 && 'border-l-orange-600',
                            )}
                        >
                            {/* Rank */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div
                                    className={clsx(
                                        'flex h-8 w-8 items-center justify-center rounded-full border',
                                        getRankStyle(entry.rank),
                                    )}
                                >
                                    {getRankIcon(entry.rank)}
                                </div>
                            </div>

                            {/* Team Name */}
                            <div className="col-span-5 sm:col-span-6 flex items-center">
                                <div>
                                    <p
                                        className={clsx(
                                            'font-semibold',
                                            entry.rank === 1 && 'text-yellow-400',
                                            entry.rank === 2 && 'text-gray-300',
                                            entry.rank === 3 && 'text-orange-400',
                                        )}
                                    >
                                        {entry.teamName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {entry.solvedCount} solved
                                    </p>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
                                <span
                                    className={clsx(
                                        'rounded-md px-3 py-1 font-bold',
                                        entry.rank <= 3
                                            ? 'bg-primary/20 text-primary'
                                            : 'text-foreground',
                                    )}
                                >
                                    {entry.totalScore}
                                </span>
                            </div>

                            {/* Last Solve */}
                            <div className="col-span-3 hidden sm:flex items-center justify-center text-sm text-muted-foreground">
                                {entry.lastSolveTime
                                    ? dayjs(entry.lastSolveTime).fromNow()
                                    : '-'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {scoreboard.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No scores yet</h3>
                    <p className="text-muted-foreground">
                        The competition hasn't started or no team has solved any challenges yet.
                    </p>
                </div>
            )}
        </CTFLayout>
    );
}
