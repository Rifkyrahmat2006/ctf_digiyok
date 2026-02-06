import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/category-badge';
import type { ChallengeCategory } from '@/types/ctf';

interface WriteupDetail {
    id: number;
    teamName: string;
    challengeTitle: string;
    challengeCategory: ChallengeCategory;
    content: string;
    updatedAt: string;
}

interface AdminWriteupShowProps {
    writeup: WriteupDetail;
}

export default function AdminWriteupShow({ writeup }: AdminWriteupShowProps) {
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <CTFAdminLayout title="View Writeup" currentPath="/ctf/admin/writeups">
            <Head title={`Writeup: ${writeup.challengeTitle}`} />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Back Button */}
                <Link href="/ctf/admin/writeups">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Writeups
                    </Button>
                </Link>

                {/* Header */}
                <div className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <CategoryBadge category={writeup.challengeCategory} size="lg" />
                                <h1 className="text-2xl font-bold">{writeup.challengeTitle}</h1>
                            </div>
                            <p className="text-muted-foreground">
                                by <span className="font-medium text-foreground">{writeup.teamName}</span>
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Last updated: {formatDate(writeup.updatedAt)}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Writeup Content</h2>
                    {writeup.content ? (
                        <div className="prose prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-mono text-sm bg-secondary/50 p-4 rounded-lg overflow-x-auto">
                                {writeup.content}
                            </pre>
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No content yet.</p>
                    )}
                </div>
            </div>
        </CTFAdminLayout>
    );
}
