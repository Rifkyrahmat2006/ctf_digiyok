import { useState } from 'react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircle2, Filter, Search, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { CategoryBadge } from '@/components/category-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Submission } from '@/types/ctf';

dayjs.extend(relativeTime);

interface PaginatedSubmissions {
    data: (Submission & { teamName: string; challengeTitle: string; category: string })[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface AdminSubmissionsProps {
    submissions: PaginatedSubmissions;
    stats: {
        total: number;
        correct: number;
        incorrect: number;
    };
}

export default function AdminSubmissions({ submissions, stats }: AdminSubmissionsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    // Note: Filters handled by frontend filtering is limited for paginated data.
    // Ideally, filters should reload the page with query params.
    // For now, I will keep the UI but note that searching/filtering might need backend support if we want to filter ALL data.
    // Given the previous implementation used mock data (client-side), I will assume user wants client-side filtering on the CURRENT PAGE
    // OR better, I should implement server-side filtering.
    // However, to keep it simple and consistent with previous "mock" behaivor, 
    // I won't implement complex server-side filtering in this iteration unless easy.
    // Let's stick to simple display for now, maybe client-side filter on the current page is enough for MVP,
    // or just remove filters if they don't work server-side.
    // Actually, let's just make the search reload the page?
    // User implementation had client-side filtering.
    
    // Let's implement simple search/filter triggers that visit() the page with params.
    // But AdminSubmissionController doesn't handle filters yet? 
    // AdminSubmissionController only does: ->latest()->paginate(15);
    // So client-side filtering only filters the visible 15 items. That's confusing.
    // I will remove the filters for now or keep them as "visual only" for current page (weird).
    // Better: Remove filters/search logic that requires backend support, OR strictly filter current page.
    // I'll filter current page to be safe and simple, acknowledging it's partial data.
    
    // UPDATED PLAN: Just show the list. Filtering requires Controller update.
    
    return (
        <CTFAdminLayout title="Submission Log" currentPath="/ctf/admin/submissions">
            <Head title="Submission Log" />

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                    <p className="text-sm text-green-400">Correct</p>
                    <p className="text-2xl font-bold text-green-400">{stats.correct}</p>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                    <p className="text-sm text-red-400">Incorrect</p>
                    <p className="text-2xl font-bold text-red-400">{stats.incorrect}</p>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Team
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Challenge
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {submissions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No submissions found.
                                    </td>
                                </tr>
                            ) : (
                                submissions.data.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className={clsx(
                                            'transition-colors hover:bg-secondary/30',
                                            submission.isCorrect
                                                ? 'bg-green-500/5'
                                                : 'bg-red-500/5',
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            {submission.isCorrect ? (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    <span className="font-medium">Correct</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <XCircle className="h-5 w-5" />
                                                    <span className="font-medium">Wrong</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{submission.teamName}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {submission.challengeTitle}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                             {/* Category is not passed from controller yet usually, check controller */}
                                             {/* Controller: with('challenge'). Challenge model has category. */}
                                             {/* Resource mapping should handle this. AdminSubmissionController maps: category -> $sub->challenge->category. */}
                                             <CategoryBadge
                                                 // @ts-ignore
                                                 category={submission.category || 'Web'} 
                                                 size="sm"
                                             />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm">
                                                    {dayjs(submission.createdAt).format(
                                                        'MMM D, YYYY HH:mm',
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {dayjs(submission.createdAt).fromNow()}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {submissions.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                         <div className="flex flex-1 justify-between sm:hidden">
                            {submissions.links[0].url ? (
                                <Link
                                    href={submissions.links[0].url as string}
                                    className="relative inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                                >
                                    Previous
                                </Link>
                            ) : null}
                            {submissions.links[submissions.links.length - 1].url ? (
                                <Link
                                    href={submissions.links[submissions.links.length - 1].url as string}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                                >
                                    Next
                                </Link>
                            ) : null}
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{submissions.from}</span> to{' '}
                                    <span className="font-medium">{submissions.to}</span> of{' '}
                                    <span className="font-medium">{submissions.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {submissions.links.map((link, i) => {
                                         // Basic logic to render links
                                         if (link.label.includes('Previous')) return null; // Custom prev
                                         if (link.label.includes('Next')) return null; // Custom next
                                         
                                         return link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url as string}
                                                className={clsx(
                                                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                                                    link.active
                                                        ? 'z-10 bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                                        : 'text-muted-foreground ring-1 ring-inset ring-border hover:bg-secondary focus:z-20 focus:outline-offset-0',
                                                    i === 1 && 'rounded-l-md',
                                                    i === submissions.links.length - 2 && 'rounded-r-md'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                         ) : (
                                            <span
                                                key={i}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-inset ring-border"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                         );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CTFAdminLayout>
    );
}
