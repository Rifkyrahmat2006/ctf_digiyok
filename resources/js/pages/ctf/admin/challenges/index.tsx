import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Edit,
    Flag,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react';

import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { CategoryBadge } from '@/components/category-badge';
import type { Challenge, ChallengeCategory } from '@/types/ctf';
import { clsx } from 'clsx';

interface AdminChallengesProps {
    challenges: Challenge[];
}

const CATEGORIES: ChallengeCategory[] = ['Web', 'Crypto', 'Forensic', 'Reverse', 'Misc'];

export default function AdminChallenges({ challenges }: AdminChallengesProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

    const filteredChallenges = challenges.filter((challenge) => {
        const matchesSearch =
            challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            challenge.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || challenge.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDeleteChallenge = (id: number) => {
        if (confirm('Are you sure you want to delete this challenge?')) {
            router.delete(route('ctf.admin.challenges.destroy', id));
        }
    };

    const handleTogglePublish = (id: number) => {
        router.post(route('ctf.admin.challenges.toggle-publish', id));
    };

    return (
        <CTFAdminLayout
            title="Challenges Management"
            currentPath="/ctf/admin/challenges"
        >
            <Head title="Challenges Management" />
            
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-4">
                    <div className="relative max-w-md flex-1">
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
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Challenge
                </Button>
            </div>

            {/* Challenges List */}
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
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Solves
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredChallenges.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No challenges found.
                                    </td>
                                </tr>
                            ) : (
                                filteredChallenges.map((challenge) => (
                                    <tr
                                        key={challenge.id}
                                        className="hover:bg-secondary/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{challenge.title}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <CategoryBadge category={challenge.category} />
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {challenge.score} pts
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={clsx(
                                                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border',
                                                    challenge.isPublished
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                                                )}
                                            >
                                                {challenge.isPublished ? 'Published' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {challenge.solvedByCount || 0}
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
                                                        onClick={() => handleTogglePublish(challenge.id)}
                                                    >
                                                        {challenge.isPublished ? (
                                                            <>
                                                                <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="mr-2 h-4 w-4" /> Publish
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-400"
                                                        onClick={() => handleDeleteChallenge(challenge.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Challenge Modal */}
            <CreateChallengeModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                challenges={challenges}
            />

            {/* Edit Challenge Modal */}
            {editingChallenge && (
                <EditChallengeModal
                    challenge={editingChallenge}
                    open={!!editingChallenge}
                    onOpenChange={(open) => !open && setEditingChallenge(null)}
                    challenges={challenges}
                />
            )}
        </CTFAdminLayout>
    );
}

function CreateChallengeModal({
    open,
    onOpenChange,
    challenges,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challenges: Challenge[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: 'Web',
        score: 100,
        flag: '',
        dependency_id: '',
        is_published: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ctf.admin.challenges.store'), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Challenge</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Challenge title"
                                required
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={data.category}
                                onValueChange={(value) => setData('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Markdown supported)</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter description..."
                            rows={5}
                            required
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="score">Score</Label>
                            <Input
                                id="score"
                                type="number"
                                value={data.score}
                                onChange={(e) => setData('score', parseInt(e.target.value) || 0)}
                                required
                            />
                            {errors.score && <p className="text-sm text-destructive">{errors.score}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dependency">Dependency (Optional)</Label>
                            <Select
                                value={data.dependency_id}
                                onValueChange={(value) => setData('dependency_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">None</SelectItem>
                                    {challenges.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="flag">Flag</Label>
                        <Input
                            id="flag"
                            value={data.flag}
                            onChange={(e) => setData('flag', e.target.value)}
                            placeholder="CTF{...}"
                            required
                        />
                        {errors.flag && <p className="text-sm text-destructive">{errors.flag}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={data.is_published}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_published', e.target.checked)}
                            className="rounded border-border bg-background"
                        />
                        <Label htmlFor="is_published">Publish immediately</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Create Challenge
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditChallengeModal({
    challenge,
    open,
    onOpenChange,
    challenges,
}: {
    challenge: Challenge;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challenges: Challenge[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        score: challenge.score,
        flag: '', // Empty by default, only set if changing
        dependency_id: challenge.dependencyId?.toString() || '',
        is_published: challenge.isPublished,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ctf.admin.challenges.update', challenge.id), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Challenge</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    {/* Same fields as Create, but flag optional */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={data.category}
                                onValueChange={(value: any) => setData('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={5}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-score">Score</Label>
                            <Input
                                id="edit-score"
                                type="number"
                                value={data.score}
                                onChange={(e) => setData('score', parseInt(e.target.value) || 0)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-dependency">Dependency</Label>
                            <Select
                                value={data.dependency_id}
                                onValueChange={(value) => setData('dependency_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">None</SelectItem>
                                    {challenges
                                        .filter((c) => c.id !== challenge.id) // Don't depend on self
                                        .map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                {c.title}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-flag">Flag (Leave empty to keep current)</Label>
                        <Input
                            id="edit-flag"
                            value={data.flag}
                            onChange={(e) => setData('flag', e.target.value)}
                            placeholder="CTF{...}"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                         <input
                            type="checkbox"
                            id="edit-is_published"
                            checked={data.is_published}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_published', e.target.checked)}
                            className="rounded border-border bg-background"
                        />
                        <Label htmlFor="edit-is_published">Published</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
