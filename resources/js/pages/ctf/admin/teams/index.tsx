import { useState } from 'react';
import dayjs from 'dayjs';
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
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockTeams } from '@/lib/mock-data';
import type { Team } from '@/types';

export default function AdminTeams() {
    const [teams, setTeams] = useState(mockTeams);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleCreateTeam = () => {
        setIsCreateModalOpen(false);
        alert('Create team functionality - frontend UI only');
    };

    const handleDeleteTeam = (teamId: number) => {
        if (confirm('Are you sure you want to delete this team?')) {
            setTeams(teams.filter((t) => t.id !== teamId));
        }
    };

    return (
        <CTFAdminLayout title="Teams Management" currentPath="/ctf/admin/teams">
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
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team
                </Button>
            </div>

            {/* Teams Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTeams.map((team) => (
                    <div
                        key={team.id}
                        className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:ctf-glow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                                    <UsersRound className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{team.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Code: {team.code || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
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

                        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">
                                    {team.totalScore}
                                </p>
                                <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{team.solvedCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Solved</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{team.memberCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Members</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                            <span>Rank #{team.rank || '-'}</span>
                            <span>{dayjs(team.createdAt).format('MMM D, YYYY')}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTeams.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <UsersRound className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No teams found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? 'Try adjusting your search'
                            : 'Create your first team to get started'}
                    </p>
                </div>
            )}

            {/* Create Team Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-card">
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                            Add a new team to the competition
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateTeam();
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input id="name" placeholder="Enter team name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Team Code (Optional)</Label>
                            <Input
                                id="code"
                                placeholder="e.g., TEAM2026"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to auto-generate
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Team</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Team Modal */}
            <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
                <DialogContent className="bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit Team</DialogTitle>
                        <DialogDescription>
                            Update team information
                        </DialogDescription>
                    </DialogHeader>
                    {editingTeam && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setEditingTeam(null);
                                alert('Edit team functionality - frontend UI only');
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Team Name</Label>
                                <Input
                                    id="edit-name"
                                    defaultValue={editingTeam.name}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Team Code</Label>
                                <Input
                                    id="edit-code"
                                    defaultValue={editingTeam.code || ''}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingTeam(null)}
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
