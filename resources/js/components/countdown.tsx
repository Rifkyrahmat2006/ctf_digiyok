import { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Clock, AlertTriangle, Play } from 'lucide-react';

interface CountdownData {
    hasEvent: boolean;
    server_time: string;
    start_time: string | null;
    end_time: string | null;
    remaining_seconds: number;
    seconds_until_start: number;
    status: 'scheduled' | 'running' | 'ended' | 'no_event';
    event_name: string | null;
}

interface CountdownProps {
    size?: 'large' | 'small';
    className?: string;
    onStatusChange?: (status: CountdownData['status']) => void;
}

export function Countdown({ size = 'small', className, onStatusChange }: CountdownProps) {
    const [data, setData] = useState<CountdownData | null>(null);
    const [displaySeconds, setDisplaySeconds] = useState<number>(0);
    const [displaySecondsUntilStart, setDisplaySecondsUntilStart] = useState<number>(0);

    const fetchCountdown = useCallback(async () => {
        try {
            const response = await fetch('/event/countdown');
            const json: CountdownData = await response.json();
            setData(json);
            setDisplaySeconds(json.remaining_seconds);
            setDisplaySecondsUntilStart(json.seconds_until_start);
            onStatusChange?.(json.status);
        } catch (error) {
            console.error('Failed to fetch countdown:', error);
        }
    }, [onStatusChange]);

    // Initial fetch and polling
    useEffect(() => {
        fetchCountdown();
        const pollInterval = setInterval(fetchCountdown, 5000); // Poll every 5 seconds
        return () => clearInterval(pollInterval);
    }, [fetchCountdown]);

    // Local countdown animation
    useEffect(() => {
        const timer = setInterval(() => {
            setDisplaySeconds((prev) => Math.max(0, prev - 1));
            setDisplaySecondsUntilStart((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format seconds to HH:MM:SS
    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    };

    if (!data || !data.hasEvent) {
        return null;
    }

    const isLarge = size === 'large';
    const status = data.status;

    // Display based on status
    if (status === 'ended') {
        return (
            <div
                className={clsx(
                    'flex items-center gap-2 rounded-lg bg-red-500/20 text-red-400',
                    isLarge ? 'p-6 text-2xl font-bold' : 'px-4 py-2 text-sm font-medium',
                    className
                )}
            >
                <AlertTriangle className={isLarge ? 'h-8 w-8' : 'h-4 w-4'} />
                <span>Time's Up!</span>
            </div>
        );
    }

    if (status === 'scheduled') {
        return (
            <div
                className={clsx(
                    'flex flex-col items-center gap-1 rounded-lg bg-yellow-500/20 text-yellow-400',
                    isLarge ? 'p-6' : 'px-4 py-2',
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    <Play className={isLarge ? 'h-6 w-6' : 'h-4 w-4'} />
                    <span className={isLarge ? 'text-lg font-medium' : 'text-xs'}>
                        Starts in
                    </span>
                </div>
                <span
                    className={clsx(
                        'font-mono font-bold tabular-nums',
                        isLarge ? 'text-4xl' : 'text-lg'
                    )}
                >
                    {formatTime(displaySecondsUntilStart)}
                </span>
            </div>
        );
    }

    // Running status
    return (
        <div
            className={clsx(
                'flex flex-col items-center gap-1 rounded-lg',
                displaySeconds <= 300 ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary',
                isLarge ? 'p-6' : 'px-4 py-2',
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Clock className={isLarge ? 'h-6 w-6' : 'h-4 w-4'} />
                <span className={isLarge ? 'text-lg font-medium' : 'text-xs'}>
                    {data.event_name || 'Time Remaining'}
                </span>
            </div>
            <span
                className={clsx(
                    'font-mono font-bold tabular-nums',
                    isLarge ? 'text-4xl' : 'text-lg',
                    displaySeconds <= 60 && 'animate-pulse'
                )}
            >
                {formatTime(displaySeconds)}
            </span>
        </div>
    );
}
