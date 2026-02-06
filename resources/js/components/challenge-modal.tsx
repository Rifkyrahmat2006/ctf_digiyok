import { useState } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Download, Flag, Loader2, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import type { Challenge } from '@/types';
import { CategoryBadge } from './category-badge';
import { ScoreBadge } from './score-badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';

interface ChallengeModalProps {
    challenge: Challenge | null;
    isOpen: boolean;
    onClose: () => void;
}

interface SubmitResponse {
    success: boolean;
    message: string;
}

export function ChallengeModal({ challenge, isOpen, onClose }: ChallengeModalProps) {
    const [flag, setFlag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    if (!challenge) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flag.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            // Using axios instead of fetch to automatically handle CSRF token
            const response = await window.axios.post(route('ctf.submissions.store'), {
                challenge_id: challenge.id,
                flag: flag.trim(),
            });

            const data: SubmitResponse = response.data;
            setSubmitResult(data);

            if (data.success) {
                // Refresh the page to update isSolved status
                setTimeout(() => {
                    router.reload({ only: ['challenges'] });
                }, 1500);
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            setSubmitResult({
                success: false,
                message: error.response?.data?.message || 'Network error. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFlag('');
        setSubmitResult(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl border-border bg-card">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <CategoryBadge category={challenge.category} />
                                <ScoreBadge score={challenge.score} />
                                {challenge.isSolved && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Solved
                                    </span>
                                )}
                            </div>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                {challenge.title}
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="sr-only">
                        Challenge details and flag submission
                    </DialogDescription>
                </DialogHeader>

                {/* Description with proper overflow handling */}
                <div className="prose prose-invert max-w-none">
                    <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm whitespace-pre-wrap break-all overflow-x-auto max-h-[200px] overflow-y-auto">
                        {challenge.description}
                    </div>
                </div>

                {/* Solved by count */}
                {typeof challenge.solvedByCount === 'number' && (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {challenge.solvedByCount}
                        </span>{' '}
                        team{challenge.solvedByCount !== 1 ? 's' : ''} have solved this challenge
                    </p>
                )}

                {/* Download file button */}
                {challenge.fileUrl && (
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm text-muted-foreground">Challenge file available</span>
                        <Button asChild variant="outline" size="sm">
                            <a href={challenge.fileUrl} download>
                                Download
                            </a>
                        </Button>
                    </div>
                )}

                {/* Flag submission form */}
                {!challenge.isSolved && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Flag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="CTF{enter_your_flag_here}"
                                    value={flag}
                                    onChange={(e) => setFlag(e.target.value)}
                                    className="pl-10 font-mono"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!flag.trim() || isSubmitting}
                                className="min-w-[100px]"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>

                        {/* Submit result feedback */}
                        {submitResult && (
                            <div
                                className={clsx(
                                    'flex items-center gap-2 rounded-lg p-3 text-sm font-medium',
                                    submitResult.success
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400',
                                )}
                            >
                                {submitResult.success ? (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {submitResult.message}
                                    </>
                                ) : (
                                    <>
                                        <X className="h-4 w-4" />
                                        {submitResult.message}
                                    </>
                                )}
                            </div>
                        )}
                    </form>
                )}

                {/* Already solved message */}
                {challenge.isSolved && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/20 p-3 text-sm font-medium text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Your team has already solved this challenge!
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

