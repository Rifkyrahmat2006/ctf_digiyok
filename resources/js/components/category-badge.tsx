import { clsx } from 'clsx';
import type { ChallengeCategory } from '@/types';
import { categoryColors } from '@/types';

interface CategoryBadgeProps {
    category: ChallengeCategory;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
    const colors = categoryColors[category];

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-md font-medium border',
                sizeClasses[size],
                colors.bg,
                colors.text,
                colors.border,
                className,
            )}
        >
            {category}
        </span>
    );
}
