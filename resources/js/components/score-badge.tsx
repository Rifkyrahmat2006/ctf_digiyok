import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';

interface ScoreBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
};

const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

export function ScoreBadge({ score, size = 'md', showIcon = true, className }: ScoreBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-md font-bold',
                'bg-primary/20 text-primary border border-primary/30',
                sizeClasses[size],
                className,
            )}
        >
            {showIcon && <Trophy className={iconSizes[size]} />}
            {score} pts
        </span>
    );
}
