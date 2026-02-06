import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { CTFLayout } from '@/layouts/ctf-layout';
import { WriteupEditor } from '@/components/writeup-editor';
import { CategoryBadge } from '@/components/category-badge';
import { Button } from '@/components/ui/button';
import type { ChallengeCategory, Writeup } from '@/types';

interface WriteupPageProps {
    challenge: {
        id: number;
        title: string;
        category: ChallengeCategory;
    };
    writeup: Writeup | null;
}

export default function WriteupPage({ challenge, writeup }: WriteupPageProps) {
    return (
        <CTFLayout title={`Writeup: ${challenge.title}`} currentPath="/challenges">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/challenges">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Challenge Info */}
                <div className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <CategoryBadge category={challenge.category} size="lg" />
                        <div>
                            <h1 className="text-2xl font-bold">{challenge.title}</h1>
                            <p className="text-muted-foreground">Writeup Challenge</p>
                        </div>
                    </div>
                </div>

                {/* Writeup Editor */}
                <div className="rounded-lg border border-border bg-card p-6">
                    <WriteupEditor
                        challengeId={challenge.id}
                        initialContent={writeup?.content ?? ''}
                        initialUpdatedAt={writeup?.updatedAt}
                    />
                </div>
            </div>
        </CTFLayout>
    );
}
