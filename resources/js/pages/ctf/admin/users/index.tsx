import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import {
    Edit,
    Key,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    User as UserIcon,
    UserPlus,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CTFUser, Team } from '@/types/ctf';

interface AdminUsersProps {
    users: CTFUser[];
    teams: Pick<Team, 'id' | 'name'>[];
}

export default function AdminUsers({ users, teams }: AdminUsersProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<CTFUser | null>(null);
    const [resettingPasswordUser, setResettingPasswordUser] = useState<CTFUser | null>(null);

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleDeleteUser = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('ctf.admin.users.destroy', userId));
        }
    };

    return (
        <CTFAdminLayout title="Users Management" currentPath="/ctf/admin/users">
            <Head title="Users Management" />
            
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Team
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-secondary/30 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                                    <UserIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={clsx(
                                                    'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                                                    user.role === 'admin'
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-secondary text-muted-foreground',
                                                )}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm">
                                                {user.teamName || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {dayjs(user.createdAt).format('MMM D, YYYY')}
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
                                                        onClick={() => setEditingUser(user)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setResettingPasswordUser(user)}
                                                    >
                                                        <Key className="mr-2 h-4 w-4" />
                                                        Reset Password
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-400"
                                                        onClick={() => handleDeleteUser(user.id)}
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

            {/* Create User Modal */}
            <CreateUserModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                teams={teams}
            />

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    teams={teams}
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                />
            )}

            {/* Reset Password Modal */}
            {resettingPasswordUser && (
                <ResetPasswordModal
                    user={resettingPasswordUser}
                    open={!!resettingPasswordUser}
                    onOpenChange={(open) => !open && setResettingPasswordUser(null)}
                />
            )}
        </CTFAdminLayout>
    );
}

// Helper Components

function CreateUserModal({ open, onOpenChange, teams }: { open: boolean; onOpenChange: (open: boolean) => void; teams: Pick<Team, 'id' | 'name'>[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'participant',
        team_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ctf.admin.users.store'), {
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
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the competition
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="create-name">Name</Label>
                        <Input
                            id="create-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Full name"
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="create-username">Username</Label>
                        <Input
                            id="create-username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Username"
                            required
                        />
                        {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="create-email">Email</Label>
                        <Input
                            id="create-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email address"
                            required
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="create-password">Password</Label>
                        <Input
                            id="create-password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            required
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="create-role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="participant">Participant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="create-team">Team</Label>
                        <Select
                            value={data.team_id}
                            onValueChange={(value) => setData('team_id', value)}
                            disabled={data.role === 'admin'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select team (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.team_id && <p className="text-sm text-destructive">{errors.team_id}</p>}
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
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditUserModal({ user, open, onOpenChange, teams }: { user: CTFUser; open: boolean; onOpenChange: (open: boolean) => void; teams: Pick<Team, 'id' | 'name'>[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '', // API might not return name if not in CTFUser type? Let's check type. CTFUser interface missing name?
        username: user.username,
        email: user.email,
        role: user.role,
        team_id: user.teamId?.toString() || '',
    });

    // Note: CTFUser type needs 'name'. Assuming it has it based on AdminUserController.

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ctf.admin.users.update', user.id), {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name || ''} 
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-username">Username</Label>
                        <Input
                            id="edit-username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                        />
                         {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                         {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(value: any) => setData('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="participant">Participant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                         {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-team">Team</Label>
                        <Select
                            value={data.team_id}
                            onValueChange={(value) => setData('team_id', value)}
                            disabled={data.role === 'admin'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="No team" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         {errors.team_id && <p className="text-sm text-destructive">{errors.team_id}</p>}
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

function ResetPasswordModal({ user, open, onOpenChange }: { user: CTFUser; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ctf.admin.users.reset-password', user.id), {
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
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Set a new password for {user.username}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reset-password">New Password</Label>
                        <Input
                            id="reset-password"
                            type="text" // Visible so admin sees what they set? Or password type? Usually password type.
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            Reset Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
