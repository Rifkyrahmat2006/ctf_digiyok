// CTF Platform Type Definitions

export type ChallengeCategory = 'Web' | 'Crypto' | 'Forensic' | 'Reverse' | 'Misc';

export type UserRole = 'admin' | 'participant';

export interface CTFUser {
    id: number;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    teamId?: number | null;
    teamName?: string;
    team?: {
        id: number;
        name: string;
    } | null;
    joinedAt?: string;
    createdAt?: string;
}

export interface Team {
    id: number;
    name: string;
    code?: string | null;
    totalScore: number;
    lastSolveTime?: string | null;
    rank?: number;
    memberCount?: number;
    solvedCount?: number;
    createdAt: string;
}

export interface TeamMember {
    id: number;
    username: string;
    email: string;
}

export interface Challenge {
    id: number;
    title: string;
    description: string;
    category: ChallengeCategory;
    score: number;
    isPublished: boolean;
    isSolved?: boolean;
    solvedByCount?: number;
    dependencyId?: number | null;
    flag?: string; // Admin only
    fileUrl?: string | null;
    fileName?: string | null;
    createdAt: string;
}

export interface Submission {
    id: number;
    teamId: number;
    teamName: string;
    challengeId: number;
    challengeTitle: string;
    isCorrect: boolean;
    submittedFlag?: string; // Admin only
    createdAt: string;
}

export interface ScoreboardEntry {
    rank: number;
    teamId: number;
    teamName: string;
    totalScore: number;
    lastSolveTime: string | null;
    solvedCount: number;
}

export interface DashboardStats {
    totalTeams: number;
    totalUsers: number;
    totalChallenges: number;
    totalSubmissions: number;
    correctSubmissions: number;
    publishedChallenges: number;
    averageScore: number;
}

// Category color mapping
export const categoryColors: Record<ChallengeCategory, { bg: string; text: string; border: string }> = {
    Web: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    Crypto: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
    Forensic: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    Reverse: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    Misc: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50' },
};
