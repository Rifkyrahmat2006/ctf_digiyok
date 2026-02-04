import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Flag, Shield, Trophy, Users } from 'lucide-react';
import { CTFLogo } from '@/components/ctf-logo';
import { Button } from '@/components/ui/button';

export default function CTFLanding() {
    const { auth } = usePage<{ auth: { user: { role: string } | null } }>().props;

    return (
        <div className="dark min-h-screen bg-background bg-gradient-dark bg-pattern-grid">
            <Head title="Welcome to BERLATIH CTF" />

            {/* Navbar */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <CTFLogo size="md" />
                    <div className="flex items-center gap-4">
                        <Link
                            href="/ctf/scoreboard"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Scoreboard
                        </Link>
                        {auth.user ? (
                            auth.user.role === 'admin' ? (
                                <Button asChild>
                                    <Link href="/ctf/admin/dashboard">Admin Dashboard</Link>
                                </Button>
                            ) : (
                                <Button asChild>
                                    <Link href="/ctf/challenges">Competition Area</Link>
                                </Button>
                            )
                        ) : (
                            <Button asChild>
                                <Link href="/ctf/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24 text-center">
                <div className="mx-auto max-w-4xl space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Shield className="h-4 w-4" />
                        Capture The Flag Competition
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                        <span className="text-gradient-red">BERLATIH</span> CTF
                        <br />
                        <span className="text-muted-foreground">2026</span>
                    </h1>

                    {/* Description */}
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Platform Lomba Cyber Security dengan berbagai tantangan menarik.
                        Uji kemampuan hacking Anda dalam kategori Web, Crypto, Forensic,
                        Reverse Engineering, dan Misc.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" asChild className="gap-2 text-lg">
                            <Link href="/ctf/login">
                                Join Competition
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-lg">
                            <Link href="/ctf/scoreboard">View Scoreboard</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t border-border/50 bg-card/30 py-24">
                <div className="container mx-auto px-4">
                    <h2 className="mb-16 text-center text-3xl font-bold">
                        Competition Features
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:ctf-glow-sm">
                            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                <Flag className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Jeopardy Style</h3>
                            <p className="text-muted-foreground">
                                Tantangan bergaya jeopardy dengan berbagai kategori: Web, Crypto,
                                Forensic, Reverse Engineering, dan Misc.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:ctf-glow-sm">
                            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Team-Based</h3>
                            <p className="text-muted-foreground">
                                Berkompetisi dalam tim. Kolaborasi dengan anggota tim untuk
                                menyelesaikan tantangan dan meraih skor tertinggi.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:ctf-glow-sm">
                            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Realtime Scoreboard</h3>
                            <p className="text-muted-foreground">
                                Pantau posisi tim Anda secara realtime. Scoreboard diperbarui
                                langsung setiap ada submission yang berhasil.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <h2 className="mb-16 text-center text-3xl font-bold">
                        Challenge Categories
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Web', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
                            { name: 'Crypto', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
                            { name: 'Forensic', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
                            { name: 'Reverse', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
                            { name: 'Misc', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
                        ].map((category) => (
                            <div
                                key={category.name}
                                className={`rounded-lg border px-6 py-3 text-lg font-semibold ${category.color}`}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2026 BERLATIH CTF Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
