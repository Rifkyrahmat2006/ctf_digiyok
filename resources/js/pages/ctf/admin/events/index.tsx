import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    Calendar,
    Clock,
    Edit,
    MoreHorizontal,
    Play,
    Plus,
    Power,
    PowerOff,
    Search,
    Trash2,
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
import { clsx } from 'clsx';

interface Event {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    status: 'scheduled' | 'running' | 'ended';
}

interface AdminEventsProps {
    events: Event[];
    activeEventId: number | null;
}

export default function AdminEvents({ events, activeEventId }: AdminEventsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteEvent = (eventId: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(route('ctf.admin.events.destroy', eventId));
        }
    };

    const handleActivate = (eventId: number) => {
        router.post(route('ctf.admin.events.activate', eventId));
    };

    const handleDeactivate = (eventId: number) => {
        router.post(route('ctf.admin.events.deactivate', eventId));
    };

    const getStatusBadge = (event: Event) => {
        const statusStyles = {
            scheduled: 'bg-yellow-500/20 text-yellow-400',
            running: 'bg-green-500/20 text-green-400',
            ended: 'bg-red-500/20 text-red-400',
        };
        return (
            <span className={clsx('px-2 py-1 rounded text-xs font-medium', statusStyles[event.status])}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
        );
    };

    return (
        <CTFAdminLayout title="Events Management" currentPath="/ctf/admin/events">
            <Head title="Events Management" />

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </div>

            {/* Events Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Event
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Start Time
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    End Time
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                    Active
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        No events found
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="border-b border-border hover:bg-secondary/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{event.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {dayjs(event.startTime).format('MMM D, YYYY HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                {dayjs(event.endTime).format('MMM D, YYYY HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(event)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {event.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                                    <Power className="h-3 w-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {!event.isActive ? (
                                                        <DropdownMenuItem onClick={() => handleActivate(event.id)}>
                                                            <Power className="mr-2 h-4 w-4" />
                                                            Activate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleDeactivate(event.id)}>
                                                            <PowerOff className="mr-2 h-4 w-4" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDeleteEvent(event.id)}
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

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Edit Event Modal */}
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    isOpen={!!editingEvent}
                    onClose={() => setEditingEvent(null)}
                />
            )}
        </CTFAdminLayout>
    );
}

// Create Event Modal
function CreateEventModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        start_time: '',
        end_time: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ctf.admin.events.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Add a new CTF competition event with start and end times.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="CTF Competition 2026"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                            id="start_time"
                            type="datetime-local"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                        />
                        {errors.start_time && <p className="text-sm text-destructive">{errors.start_time}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                            id="end_time"
                            type="datetime-local"
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                        />
                        {errors.end_time && <p className="text-sm text-destructive">{errors.end_time}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Edit Event Modal
function EditEventModal({ event, isOpen, onClose }: { event: Event; isOpen: boolean; onClose: () => void }) {
    const { data, setData, put, processing, errors } = useForm({
        name: event.name,
        start_time: dayjs(event.startTime).format('YYYY-MM-DDTHH:mm'),
        end_time: dayjs(event.endTime).format('YYYY-MM-DDTHH:mm'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ctf.admin.events.update', event.id), {
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Update the event details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Event Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-start_time">Start Time</Label>
                        <Input
                            id="edit-start_time"
                            type="datetime-local"
                            value={data.start_time}
                            onChange={(e) => setData('start_time', e.target.value)}
                        />
                        {errors.start_time && <p className="text-sm text-destructive">{errors.start_time}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-end_time">End Time</Label>
                        <Input
                            id="edit-end_time"
                            type="datetime-local"
                            value={data.end_time}
                            onChange={(e) => setData('end_time', e.target.value)}
                        />
                        {errors.end_time && <p className="text-sm text-destructive">{errors.end_time}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
