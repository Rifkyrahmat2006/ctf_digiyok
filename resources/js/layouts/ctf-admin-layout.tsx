import { Head, Link, usePage } from '@inertiajs/react';
import { clsx } from 'clsx';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    Flag,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    UsersRound,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { CTFLogo } from '@/components/ctf-logo';
import { Button } from '@/components/ui/button';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/ctf/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/ctf/admin/users', icon: Users },
    { label: 'Teams', href: '/ctf/admin/teams', icon: UsersRound },
    { label: 'Challenges', href: '/ctf/admin/challenges', icon: Flag },
    { label: 'Submissions', href: '/ctf/admin/submissions', icon: FileText },
];

interface CTFAdminLayoutProps extends PropsWithChildren {
    title?: string;
    currentPath?: string;
}

export function CTFAdminLayout({ children, title, currentPath }: CTFAdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [showFlash, setShowFlash] = useState(false);
    const safeFlash = flash || {};

    useEffect(() => {
        if (safeFlash.success || safeFlash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="dark flex min-h-screen bg-background">
            <Head title={title ? `${title} - Admin` : 'Admin'} />

            {/* Flash Notification */}
            {showFlash && (safeFlash.success || safeFlash.error) && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in">
                    <div className={clsx(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
                        safeFlash.success ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                        {safeFlash.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <p className="text-sm font-medium">{safeFlash.success || safeFlash.error}</p>
                        <button onClick={() => setShowFlash(false)} className="ml-2 hover:opacity-70">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300',
                    sidebarCollapsed ? 'w-16' : 'w-64',
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                    {!sidebarCollapsed && <CTFLogo size="sm" />}
                    {sidebarCollapsed && <CTFLogo size="sm" showText={false} />}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-2">
                    {navItems.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-primary'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                                    sidebarCollapsed && 'justify-center px-2',
                                )}
                                title={sidebarCollapsed ? item.label : undefined}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={clsx(
                            'w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-400',
                            sidebarCollapsed && 'justify-center px-2',
                        )}
                        // Link for Logout - assuming generic logout route
                         asChild
                    >
                        <Link href="/logout" method="post" as="button">
                            <LogOut className="h-5 w-5" />
                            {!sidebarCollapsed && <span>Logout</span>}
                        </Link>
                    </Button>
                </div>

                {/* Collapse toggle */}
                <button
                    type="button"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-secondary"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </aside>

            {/* Main content */}
            <div
                className={clsx(
                    'flex-1 transition-all duration-300',
                    sidebarCollapsed ? 'ml-16' : 'ml-64',
                )}
            >
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
                    <h1 className="text-xl font-semibold">{title || 'Admin Panel'}</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Admin</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <Settings className="h-4 w-4" />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
