import { useState, useMemo } from 'react';
import { Filter, Search, Trophy } from 'lucide-react';
import { CTFLayout } from '@/layouts/ctf-layout';
import { ChallengeCard } from '@/components/challenge-card';
import { ChallengeModal } from '@/components/challenge-modal';
import { CategoryBadge } from '@/components/category-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Challenge, ChallengeCategory } from '@/types';

const categories: (ChallengeCategory | 'All')[] = [
    'All',
    'Web',
    'Crypto',
    'Forensic',
    'Reverse',
    'Misc',
];

interface CTFChallengesProps {
    challenges: Challenge[];
}

export default function CTFChallenges({ challenges }: CTFChallengesProps) {
    const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter challenges based on category and search
    // challenges prop already contains only published challenges for participants usually, 
    // or we check isPublished. Controller should filter published.
    // Assuming controller returns: Challenge::where('is_published', true)...
    
    // Note: Controller returns list of challenges.
    
    const filteredChallenges = useMemo(() => {
        return challenges.filter((challenge) => {
            const matchesCategory =
                selectedCategory === 'All' || challenge.category === selectedCategory;
            const matchesSearch = challenge.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [challenges, selectedCategory, searchQuery]);

    // Group challenges by category for display
    const challengesByCategory = useMemo(() => {
        if (selectedCategory !== 'All') {
            return { [selectedCategory]: filteredChallenges };
        }

        const grouped: Record<string, Challenge[]> = {};
        filteredChallenges.forEach((challenge) => {
            if (!grouped[challenge.category]) {
                grouped[challenge.category] = [];
            }
            grouped[challenge.category].push(challenge);
        });
        return grouped;
    }, [filteredChallenges, selectedCategory]);

    const handleChallengeClick = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedChallenge(null);
    };

    // Calculate team stats
    const solvedCount = challenges.filter((c) => c.isSolved).length;
    const totalScore = challenges
        .filter((c) => c.isSolved)
        .reduce((sum, c) => sum + c.score, 0);

    return (
        <CTFLayout title="Challenges" currentPath="/ctf/challenges">
            {/* Page Header */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Challenges</h1>
                        <p className="text-muted-foreground">
                            Solve challenges to earn points for your team
                        </p>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Team Score</p>
                            <p className="text-xl font-bold">
                                {totalScore}{' '}
                                <span className="text-sm font-normal text-muted-foreground">
                                    pts ({solvedCount}/{challenges.length} solved)
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category === 'All' ? (
                                    <>
                                        <Filter className="mr-1 h-3 w-3" />
                                        All
                                    </>
                                ) : (
                                    category
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Challenges Grid */}
            {Object.keys(challengesByCategory).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No challenges found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(challengesByCategory).map(([category, challenges]) => (
                        <div key={category}>
                            <div className="mb-4 flex items-center gap-3">
                                <CategoryBadge
                                    category={category as ChallengeCategory}
                                    size="lg"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {challenges.length} challenge
                                    {challenges.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {challenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        onClick={() => handleChallengeClick(challenge)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Challenge Modal */}
            <ChallengeModal
                challenge={selectedChallenge}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </CTFLayout>
    );
}
