import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import {
    Edit,
    Eye,
    EyeOff,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { CategoryBadge } from '@/components/category-badge';
import { ScoreBadge } from '@/components/score-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { mockChallenges } from '@/lib/mock-data';
import type { Challenge, ChallengeCategory } from '@/types';

const categories: ChallengeCategory[] = ['Web', 'Crypto', 'Forensic', 'Reverse', 'Misc'];

export default function AdminChallenges() {
    const [challenges, setChallenges] = useState(mockChallenges);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<ChallengeCategory | 'all'>('all');
    const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'unpublished'>(
        'all',
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

    const filteredChallenges = useMemo(() => {
        return challenges.filter((challenge) => {
            const matchesSearch = challenge.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCategory =
                filterCategory === 'all' || challenge.category === filterCategory;
            const matchesPublished =
                filterPublished === 'all' ||
                (filterPublished === 'published' && challenge.isPublished) ||
                (filterPublished === 'unpublished' && !challenge.isPublished);
            return matchesSearch && matchesCategory && matchesPublished;
        });
    }, [challenges, searchQuery, filterCategory, filterPublished]);

    const togglePublish = (challengeId: number) => {
        setChallenges(
            challenges.map((c) =>
                c.id === challengeId ? { ...c, isPublished: !c.isPublished } : c,
            ),
        );
    };

    const handleDeleteChallenge = (challengeId: number) => {
        if (confirm('Are you sure you want to delete this challenge?')) {
            setChallenges(challenges.filter((c) => c.id !== challengeId));
        }
    };

    return (
        <CTFAdminLayout title="Challenges Management" currentPath="/ctf/admin/challenges">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filterCategory}
                        onValueChange={(v) => setFilterCategory(v as ChallengeCategory | 'all')}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filterPublished}
                        onValueChange={(v) =>
                            setFilterPublished(v as 'all' | 'published' | 'unpublished')
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="unpublished">Unpublished</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Challenge
                </Button>
            </div>

            {/* Challenges Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Challenge
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Score
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Solves
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredChallenges.map((challenge) => (
                                <tr
                                    key={challenge.id}
                                    className="hover:bg-secondary/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{challenge.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {challenge.description.substring(0, 60)}...
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <CategoryBadge category={challenge.category} size="sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <ScoreBadge
                                            score={challenge.score}
                                            size="sm"
                                            showIcon={false}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {challenge.solvedByCount || 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => togglePublish(challenge.id)}
                                            className={clsx(
                                                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                                                challenge.isPublished
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                            )}
                                        >
                                            {challenge.isPublished ? (
                                                <>
                                                    <Eye className="h-3 w-3" /> Published
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3" /> Hidden
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => setEditingChallenge(challenge)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => togglePublish(challenge.id)}
                                                >
                                                    {challenge.isPublished ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-400 focus:text-red-400"
                                                    onClick={() =>
                                                        handleDeleteChallenge(challenge.id)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Challenge Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-card max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Challenge</DialogTitle>
                        <DialogDescription>
                            Add a new challenge to the competition
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setIsCreateModalOpen(false);
                            alert('Create challenge functionality - frontend UI only');
                        }}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Challenge title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Markdown)</Label>
                            <textarea
                                id="description"
                                className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                placeholder="## Description&#10;&#10;Enter challenge description here..."
                                required
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="score">Score (Points)</Label>
                                <Input
                                    id="score"
                                    type="number"
                                    placeholder="100"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="flag">Flag</Label>
                                <Input
                                    id="flag"
                                    type="text"
                                    placeholder="CTF{flag_here}"
                                    className="font-mono"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="published" />
                            <Label htmlFor="published" className="text-sm font-normal">
                                Publish immediately
                            </Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Challenge</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Challenge Modal */}
            <Dialog open={!!editingChallenge} onOpenChange={() => setEditingChallenge(null)}>
                <DialogContent className="bg-card max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Challenge</DialogTitle>
                        <DialogDescription>
                            Update challenge information
                        </DialogDescription>
                    </DialogHeader>
                    {editingChallenge && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setEditingChallenge(null);
                                alert('Edit challenge functionality - frontend UI only');
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                        id="edit-title"
                                        defaultValue={editingChallenge.title}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select defaultValue={editingChallenge.category}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description (Markdown)</Label>
                                <textarea
                                    id="edit-description"
                                    className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                    defaultValue={editingChallenge.description}
                                    required
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-score">Score (Points)</Label>
                                    <Input
                                        id="edit-score"
                                        type="number"
                                        defaultValue={editingChallenge.score}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-flag">New Flag (leave empty to keep)</Label>
                                    <Input
                                        id="edit-flag"
                                        type="text"
                                        placeholder="CTF{new_flag}"
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="edit-published"
                                    defaultChecked={editingChallenge.isPublished}
                                />
                                <Label htmlFor="edit-published" className="text-sm font-normal">
                                    Published
                                </Label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingChallenge(null)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </CTFAdminLayout>
    );
}
