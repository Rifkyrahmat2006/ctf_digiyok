import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { CTFNavbar } from '@/components/ctf-navbar';

interface CTFLayoutProps extends PropsWithChildren {
    title?: string;
    currentPath?: string;
}

export function CTFLayout({ children, title, currentPath }: CTFLayoutProps) {
    return (
        <div className="dark min-h-screen bg-background bg-gradient-dark">
            <Head title={title} />
            <CTFNavbar currentPath={currentPath} />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <footer className="border-t border-border py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2026 BERLATIH CTF Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
