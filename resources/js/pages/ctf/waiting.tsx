import { useEffect, useState, useCallback } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Clock, Play, AlertTriangle, Trophy, Shield, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { CTFLogo } from '@/components/ctf-logo';
import { Button } from '@/components/ui/button';

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

interface WaitingPageProps {
    countdownData: CountdownData;
}

export default function WaitingPage({ countdownData: initialData }: WaitingPageProps) {
    const [data, setData] = useState<CountdownData>(initialData);
    const [displaySeconds, setDisplaySeconds] = useState<number>(initialData.seconds_until_start);

    const fetchCountdown = useCallback(async () => {
        try {
            const response = await fetch('/ctf/event/countdown');
            const json: CountdownData = await response.json();
            setData(json);
            setDisplaySeconds(json.seconds_until_start);

            // If event is now running, redirect to challenges
            if (json.status === 'running') {
                router.visit('/ctf/challenges');
            }
        } catch (error) {
            console.error('Failed to fetch countdown:', error);
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        const pollInterval = setInterval(fetchCountdown, 3000); // Poll every 3 seconds
        return () => clearInterval(pollInterval);
    }, [fetchCountdown]);

    // Local countdown animation
    useEffect(() => {
        const timer = setInterval(() => {
            setDisplaySeconds((prev) => {
                const newValue = Math.max(0, prev - 1);
                // When countdown reaches 0, trigger a fetch to check status
                if (newValue === 0) {
                    fetchCountdown();
                }
                return newValue;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [fetchCountdown]);

    // Format seconds to HH:MM:SS
    const formatTime = (totalSeconds: number): { hours: string; minutes: string; seconds: string } => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
        };
    };

    const time = formatTime(displaySeconds);

    // No event configured
    if (!data.hasEvent) {
        return (
            <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <Head title="No Event" />
                {/* Logout button */}
                <div className="fixed top-4 right-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                        <Link href="/logout" method="post" as="button">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Link>
                    </Button>
                </div>
                <div className="text-center">
                    <Shield className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                        No Active Event
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Please wait for the competition to be scheduled.
                    </p>
                </div>
            </div>
        );
    }

    // Event ended
    if (data.status === 'ended') {
        return (
            <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <Head title="Competition Ended" />
                {/* Logout button */}
                <div className="fixed top-4 right-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                        <Link href="/logout" method="post" as="button">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Link>
                    </Button>
                </div>
                <div className="text-center">
                    <Trophy className="mx-auto mb-6 h-16 w-16 text-yellow-500" />
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                        Competition Has Ended
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Thank you for participating in {data.event_name}!
                    </p>
                </div>
            </div>
        );
    }

    // Waiting for event to start
    return (
        <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Head title="Waiting for Competition" />

            {/* Logo - Top Left */}
            <div className="fixed top-4 left-4 z-20">
                <CTFLogo size="sm" />
            </div>

            {/* Logout button - Top Right */}
            <div className="fixed top-4 right-4 z-20">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                    <Link href="/logout" method="post" as="button">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Link>
                </Button>
            </div>

            {/* Background decoration */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
                {/* Event name */}
                <h1 className="mb-4 text-2xl font-bold text-foreground md:text-4xl">
                    {data.event_name || 'CTF Competition'}
                </h1>

                {/* Status message */}
                <div className="mb-8 flex items-center justify-center gap-2 text-yellow-400">
                    <Play className="h-5 w-5" />
                    <span className="text-lg font-medium">Competition starts in</span>
                </div>

                {/* Countdown display */}
                <div className="mb-12 flex items-center justify-center gap-4">
                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-card border border-border shadow-lg md:h-32 md:w-32">
                            <span className="text-4xl font-bold tabular-nums text-primary md:text-6xl">
                                {time.hours}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Hours</span>
                    </div>

                    <span className="text-4xl font-bold text-muted-foreground md:text-6xl">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-card border border-border shadow-lg md:h-32 md:w-32">
                            <span className="text-4xl font-bold tabular-nums text-primary md:text-6xl">
                                {time.minutes}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Minutes</span>
                    </div>

                    <span className="text-4xl font-bold text-muted-foreground md:text-6xl">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                        <div className={clsx(
                            "mb-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-card border border-border shadow-lg md:h-32 md:w-32",
                            displaySeconds <= 10 && "animate-pulse border-red-500/50"
                        )}>
                            <span className={clsx(
                                "text-4xl font-bold tabular-nums md:text-6xl",
                                displaySeconds <= 10 ? "text-red-400" : "text-primary"
                            )}>
                                {time.seconds}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">Seconds</span>
                    </div>
                </div>

                {/* Info message */}
                <div className="mx-auto max-w-md rounded-xl border border-border bg-card/50 p-6 text-center">
                    <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        Get ready! The challenges will be revealed automatically when the countdown reaches zero.
                    </p>
                </div>
            </div>
        </div>
    );
}
