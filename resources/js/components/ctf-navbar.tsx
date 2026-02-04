import { Link, usePage } from '@inertiajs/react';
import { clsx } from 'clsx';
import { Flag, LogOut, Menu, Trophy, User, Users, X } from 'lucide-react';
import { useState } from 'react';
import { CTFLogo } from './ctf-logo';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Challenges', href: '/ctf/challenges', icon: Flag },
    { label: 'Scoreboard', href: '/ctf/scoreboard', icon: Trophy },
    { label: 'Team', href: '/ctf/team', icon: Users },
];

interface CTFNavbarProps {
    currentPath?: string;
}

export function CTFNavbar({ currentPath }: CTFNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: { user: { name: string; username: string; team_id?: number | null; role: string } | null } }>().props;

    // Use accessors or fallbacks for user display
    const displayName = auth.user?.username || auth.user?.name || 'Guest'; 
    const displayTeam = auth.user?.role === 'admin' ? 'Administrator' : (auth.user?.team_id ? 'Team Member' : 'No Team');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/ctf" className="flex items-center">
                    <CTFLogo size="md" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* User Menu */}
                <div className="hidden items-center gap-4 md:flex">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{displayName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {displayTeam}
                                        </p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href="/ctf/team" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        My Team
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="text-red-400 focus:text-red-400 cursor-pointer">
                                    <Link href="/logout" method="post" as="button" className="flex w-full items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <Link href="/ctf/login">Login</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-background md:hidden">
                    <div className="container mx-auto space-y-1 px-4 py-4">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={clsx(
                                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        
                        {auth.user ? (
                            <>
                                <div className="my-2 border-t border-border" />
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{displayName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {displayTeam}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <div className="mt-4 px-4">
                                 <Button asChild className="w-full">
                                    <Link href="/ctf/login">Login</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
