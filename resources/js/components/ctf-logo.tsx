import { Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface CTFLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
};

const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
};

export function CTFLogo({ size = 'md', showText = true, className }: CTFLogoProps) {
    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <div className="relative">
                <Shield
                    className={clsx(
                        sizeClasses[size],
                        'text-primary fill-primary/20 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
                    )}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className={clsx(
                            'font-bold text-primary-foreground',
                            size === 'sm' && 'text-[8px]',
                            size === 'md' && 'text-[10px]',
                            size === 'lg' && 'text-xs',
                            size === 'xl' && 'text-sm',
                        )}
                    >
                        CTF
                    </span>
                </div>
            </div>
            {showText && (
                <span
                    className={clsx(
                        'font-bold tracking-tight',
                        textSizeClasses[size],
                        'text-gradient-red',
                    )}
                >
                    DIGIYOK
                </span>
            )}
        </div>
    );
}
