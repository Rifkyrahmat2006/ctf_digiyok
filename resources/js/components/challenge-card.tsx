import { clsx } from 'clsx';
import { CheckCircle2, Lock } from 'lucide-react';
import type { Challenge } from '@/types';
import { CategoryBadge } from './category-badge';
import { ScoreBadge } from './score-badge';

interface ChallengeCardProps {
    challenge: Challenge;
    onClick?: () => void;
    isLocked?: boolean;
    className?: string;
}

export function ChallengeCard({
    challenge,
    onClick,
    isLocked = false,
    className,
}: ChallengeCardProps) {
    const isSolved = challenge.isSolved;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLocked}
            className={clsx(
                'group relative w-full rounded-lg border p-4 text-left transition-all duration-300 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                'hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]',
                isLocked
                    ? 'cursor-not-allowed border-border/50 bg-card/50 opacity-60'
                    : isSolved
                      ? 'border-green-500/50 bg-green-500/5 hover:border-green-500 hover:bg-green-500/10 hover:shadow-lg hover:shadow-green-500/20'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/20 hover:ctf-glow-sm',
                className,
            )}
        >
            {/* Solved indicator */}
            {isSolved && (
                <div className="absolute -right-2 -top-2">
                    <div className="rounded-full bg-green-500 p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                </div>
            )}

            {/* Locked indicator */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
            )}

            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className={clsx(
                            'font-semibold leading-tight',
                            isSolved ? 'text-green-400' : 'text-foreground',
                            'group-hover:text-primary transition-colors',
                        )}
                    >
                        {challenge.title}
                    </h3>
                </div>

                {/* Category and Score */}
                <div className="flex items-center justify-between gap-2">
                    <CategoryBadge category={challenge.category} size="sm" />
                    <ScoreBadge score={challenge.score} size="sm" showIcon={false} />
                </div>

                {/* Solved count */}
                {typeof challenge.solvedByCount === 'number' && (
                    <p className="text-xs text-muted-foreground">
                        {challenge.solvedByCount} team{challenge.solvedByCount !== 1 ? 's' : ''}{' '}
                        solved
                    </p>
                )}
            </div>
        </button>
    );
}
