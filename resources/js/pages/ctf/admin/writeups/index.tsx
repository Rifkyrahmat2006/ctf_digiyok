import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';

import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CategoryBadge } from '@/components/category-badge';
import type { ChallengeCategory } from '@/types/ctf';

interface WriteupItem {
    id: number;
    teamId: number;
    teamName: string;
    challengeId: number;
    challengeTitle: string;
    challengeCategory: ChallengeCategory;
    content: string;
    contentPreview: string;
    updatedAt: string;
}

interface ChallengeOption {
    id: number;
    title: string;
    category: ChallengeCategory;
}

interface AdminWriteupsProps {
    writeups: WriteupItem[];
    challenges: ChallengeOption[];
}

export default function AdminWriteups({ writeups, challenges }: AdminWriteupsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState<string>('all');

    const filteredWriteups = writeups.filter((writeup) => {
        const matchesSearch =
            writeup.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            writeup.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesChallenge =
            selectedChallenge === 'all' || writeup.challengeId.toString() === selectedChallenge;
        return matchesSearch && matchesChallenge;
    });

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <CTFAdminLayout title="Writeups" currentPath="/admin/writeups">
            <Head title="Writeups Management" />

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-4">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by team or challenge..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={selectedChallenge}
                        onValueChange={setSelectedChallenge}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by Challenge" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Challenges</SelectItem>
                            {challenges.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                    {filteredWriteups.length} writeup(s)
                </p>
            </div>

            {/* Writeups List */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Team
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Challenge
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Preview
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredWriteups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No writeups found.
                                    </td>
                                </tr>
                            ) : (
                                filteredWriteups.map((writeup) => (
                                    <tr
                                        key={writeup.id}
                                        className="hover:bg-secondary/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{writeup.teamName}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <CategoryBadge category={writeup.challengeCategory} />
                                                <span className="text-sm">{writeup.challengeTitle}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-[300px]">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {writeup.contentPreview || '(empty)'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {formatDate(writeup.updatedAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/writeups/${writeup.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </CTFAdminLayout>
    );
}
