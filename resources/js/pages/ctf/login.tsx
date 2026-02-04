import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { CTFLogo } from '@/components/ctf-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CTFLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate loading - in real app this would be Inertia form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        // Demo: just show alert
        alert('Login functionality not implemented in frontend-only mode');
    };

    return (
        <div className="dark min-h-screen bg-background bg-gradient-dark bg-pattern-grid">
            <Head title="Login" />

            {/* Back to home link */}
            <div className="absolute left-4 top-4">
                <Link
                    href="/ctf"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to Home
                </Link>
            </div>

            {/* Login Card */}
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <CTFLogo size="xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Login to access the competition
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-xl">
                            <div className="space-y-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            value={formData.username}
                                            onChange={(e) =>
                                                setFormData({ ...formData, username: e.target.value })
                                            }
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-6 w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Footer text */}
                    <p className="text-center text-sm text-muted-foreground">
                        User accounts are created by admin.
                        <br />
                        Contact your administrator if you don't have an account.
                    </p>
                </div>
            </div>
        </div>
    );
}
