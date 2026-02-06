import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
    UsersRound,
} from 'lucide-react';

import { CTFAdminLayout } from '@/layouts/ctf-admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import type { Team } from '@/types/ctf';

interface AdminTeamsProps {
    teams: Team[];
}

export default function AdminTeams({ teams }: AdminTeamsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const filteredTeams = teams.filter(
        (team) =>
            team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (team.code && team.code.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    const handleDeleteTeam = (teamId: number) => {
        if (confirm('Are you sure you want to delete this team? All members and submissions will be deleted.')) {
            router.delete(route('ctf.admin.teams.destroy', teamId));
        }
    };

    return (
        <CTFAdminLayout title="Teams Management" currentPath="/admin/teams">
            <Head title="Teams Management" />
            
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UsersRound className="mr-2 h-4 w-4" />
                    Create Team
                </Button>
            </div>

            {/* Teams Grid */}
            {filteredTeams.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                    No teams found.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTeams.map((team) => (
                        <div
                            key={team.id}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setEditingTeam(team)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-400 focus:text-red-400"
                                                onClick={() => handleDeleteTeam(team.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <h3 className="mb-1 text-lg font-bold">{team.name}</h3>
                                <p className="mb-4 text-sm font-mono text-muted-foreground">
                                    Code: <span className="text-foreground">{team.code || '-'}</span>
                                </p>

                                <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Score</p>
                                        <p className="font-bold text-primary">{team.totalScore}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Solved</p>
                                        <p className="font-bold text-green-400">{team.solvedCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Members</p>
                                        <p className="font-bold text-blue-400">{team.memberCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Team Modal */}
            <CreateTeamModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            {/* Edit Team Modal */}
            {editingTeam && (
                <EditTeamModal
                    team={editingTeam}
                    open={!!editingTeam}
                    onOpenChange={(open) => !open && setEditingTeam(null)}
                />
            )}
        </CTFAdminLayout>
    );
}

function CreateTeamModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ctf.admin.teams.store'), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card">
                <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                        Create a new team for participants
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter team name"
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Team Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="Ex: TM001 (optional)"
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
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
                            Create Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditTeamModal({ team, open, onOpenChange }: { team: Team; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { data, setData, put, processing, errors } = useForm({
        name: team.name,
        code: team.code || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ctf.admin.teams.update', team.id), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card">
                <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Team Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter team name"
                            required
                        />
                         {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-code">Team Code</Label>
                        <Input
                            id="edit-code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="Ex: TM001"
                        />
                         {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
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
