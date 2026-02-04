import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
}: StatCardProps) {
    return (
        <div
            className={clsx(
                'rounded-lg border border-border bg-card p-6',
                'hover:border-primary/50 hover:ctf-glow-sm transition-all duration-300',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-foreground">{value}</p>
                        {trend && (
                            <span
                                className={clsx(
                                    'text-xs font-medium',
                                    trend.isPositive ? 'text-green-500' : 'text-red-500',
                                )}
                            >
                                {trend.isPositive ? '+' : '-'}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
    );
}
