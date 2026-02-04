import type {
    Challenge,
    CTFUser,
    DashboardStats,
    ScoreboardEntry,
    Submission,
    Team,
    TeamMember,
} from '@/types';

// Mock Teams
export const mockTeams: Team[] = [
    {
        id: 1,
        name: 'Binary Dragons',
        code: 'BD2026',
        totalScore: 2500,
        lastSolveTime: '2026-02-04T04:30:00Z',
        rank: 1,
        memberCount: 3,
        solvedCount: 8,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 2,
        name: 'Cyber Phantoms',
        code: 'CP2026',
        totalScore: 2100,
        lastSolveTime: '2026-02-04T04:15:00Z',
        rank: 2,
        memberCount: 3,
        solvedCount: 7,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 3,
        name: 'Root Access',
        code: 'RA2026',
        totalScore: 1800,
        lastSolveTime: '2026-02-04T03:45:00Z',
        rank: 3,
        memberCount: 2,
        solvedCount: 6,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 4,
        name: 'Buffer Overflow',
        code: 'BO2026',
        totalScore: 1500,
        lastSolveTime: '2026-02-04T03:30:00Z',
        rank: 4,
        memberCount: 3,
        solvedCount: 5,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 5,
        name: 'Stack Smashers',
        code: 'SS2026',
        totalScore: 1200,
        lastSolveTime: '2026-02-04T02:00:00Z',
        rank: 5,
        memberCount: 2,
        solvedCount: 4,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 6,
        name: 'Zero Day Squad',
        code: 'ZD2026',
        totalScore: 900,
        lastSolveTime: '2026-02-04T01:30:00Z',
        rank: 6,
        memberCount: 3,
        solvedCount: 3,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 7,
        name: 'Packet Sniffers',
        code: 'PS2026',
        totalScore: 600,
        lastSolveTime: '2026-02-03T23:00:00Z',
        rank: 7,
        memberCount: 2,
        solvedCount: 2,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 8,
        name: 'Shell Shocked',
        code: 'SH2026',
        totalScore: 300,
        lastSolveTime: '2026-02-03T22:00:00Z',
        rank: 8,
        memberCount: 3,
        solvedCount: 1,
        createdAt: '2026-02-01T00:00:00Z',
    },
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
    { id: 1, username: 'dragonmaster', email: 'dragon@example.com' },
    { id: 2, username: 'binaryboss', email: 'binary@example.com' },
    { id: 3, username: 'codebreaker', email: 'coder@example.com' },
];

// Mock Users
export const mockUsers: CTFUser[] = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@ctfd.local',
        role: 'admin',
        teamId: null,
        createdAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 2,
        username: 'dragonmaster',
        email: 'dragon@example.com',
        role: 'participant',
        teamId: 1,
        teamName: 'Binary Dragons',
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 3,
        username: 'binaryboss',
        email: 'binary@example.com',
        role: 'participant',
        teamId: 1,
        teamName: 'Binary Dragons',
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 4,
        username: 'phantom1',
        email: 'phantom1@example.com',
        role: 'participant',
        teamId: 2,
        teamName: 'Cyber Phantoms',
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 5,
        username: 'rooter',
        email: 'root@example.com',
        role: 'participant',
        teamId: 3,
        teamName: 'Root Access',
        createdAt: '2026-02-01T00:00:00Z',
    },
];

// Mock Challenges
export const mockChallenges: Challenge[] = [
    {
        id: 1,
        title: 'Baby Web',
        description:
            '## Description\n\nA simple web challenge to get you started. Can you find the hidden flag?\n\n**Hint**: Check the source code carefully.\n\n## Connection\n\n`http://challenge.ctf.local:8080`',
        category: 'Web',
        score: 100,
        isPublished: true,
        isSolved: true,
        solvedByCount: 15,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 2,
        title: 'SQL Injection 101',
        description:
            "## Description\n\nCan you bypass the login page?\n\nThe admin left some vulnerabilities in the authentication system.\n\n## Connection\n\n`http://challenge.ctf.local:8081`\n\n## Note\n\nDon't forget to check for common SQL injection patterns.",
        category: 'Web',
        score: 200,
        isPublished: true,
        isSolved: true,
        solvedByCount: 10,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 3,
        title: 'XSS Adventure',
        description:
            '## Description\n\nFind a way to execute JavaScript on the vulnerable page and steal the admin cookie.\n\n## Connection\n\n`http://challenge.ctf.local:8082`',
        category: 'Web',
        score: 300,
        isPublished: true,
        isSolved: false,
        solvedByCount: 5,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 4,
        title: 'Caesar Cipher',
        description:
            '## Description\n\nA classic encryption method. Can you decode the message?\n\n```\nIODJVLEFEJ\n```\n\n**Flag format**: `CTF{decoded_message}`',
        category: 'Crypto',
        score: 100,
        isPublished: true,
        isSolved: true,
        solvedByCount: 20,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 5,
        title: 'RSA Basics',
        description:
            '## Description\n\nYou intercepted an RSA encrypted message. Can you decrypt it?\n\n```\nn = 3233\ne = 17\nc = 2790\n```\n\nFind the plaintext!',
        category: 'Crypto',
        score: 250,
        isPublished: true,
        isSolved: false,
        solvedByCount: 8,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 6,
        title: 'Memory Dump',
        description:
            "## Description\n\nWe captured a memory dump from a suspicious process. Can you find the hidden credentials?\n\n## Files\n\n- [memory.dmp](/files/memory.dmp)\n\n**Hint**: Use volatility or similar tools.",
        category: 'Forensic',
        score: 300,
        isPublished: true,
        isSolved: false,
        solvedByCount: 3,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 7,
        title: 'Steganography',
        description:
            '## Description\n\nThere is a secret hidden in this image. Can you find it?\n\n## Files\n\n- [secret.png](/files/secret.png)',
        category: 'Forensic',
        score: 150,
        isPublished: true,
        isSolved: true,
        solvedByCount: 12,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 8,
        title: 'CrackMe 1',
        description:
            '## Description\n\nReverse engineer this binary to find the correct password.\n\n## Files\n\n- [crackme](/files/crackme)\n\n**Note**: Linux x64 ELF binary',
        category: 'Reverse',
        score: 200,
        isPublished: true,
        isSolved: false,
        solvedByCount: 6,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 9,
        title: 'Obfuscated JS',
        description:
            '## Description\n\nThis JavaScript is heavily obfuscated. Can you figure out what the password is?\n\n```javascript\neval(atob("ZnVuY3Rpb24gY2hlY2soeCl7cmV0dXJuIHg9PT0nZmxhZyd9"));\n```',
        category: 'Reverse',
        score: 150,
        isPublished: true,
        isSolved: true,
        solvedByCount: 9,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 10,
        title: 'Sanity Check',
        description:
            '## Description\n\nWelcome to the CTF! Here is your first flag:\n\n```\nCTF{welcome_to_the_competition}\n```\n\nJust submit it to make sure everything works!',
        category: 'Misc',
        score: 50,
        isPublished: true,
        isSolved: true,
        solvedByCount: 25,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 11,
        title: 'Hidden in Plain Sight',
        description:
            '## Description\n\nThe flag is hidden somewhere on this page. Look carefully!\n\n<!-- FLAG{not_this_one} -->\n\n**Hint**: Sometimes things are hidden in unusual places.',
        category: 'Misc',
        score: 100,
        isPublished: true,
        isSolved: false,
        solvedByCount: 7,
        createdAt: '2026-02-01T00:00:00Z',
    },
    {
        id: 12,
        title: 'Advanced Web Exploitation',
        description:
            '## Description\n\nThis is an advanced challenge combining multiple web vulnerabilities.\n\n## Connection\n\n`http://challenge.ctf.local:8090`',
        category: 'Web',
        score: 500,
        isPublished: false,
        isSolved: false,
        solvedByCount: 0,
        createdAt: '2026-02-01T00:00:00Z',
    },
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
    {
        id: 1,
        teamId: 1,
        teamName: 'Binary Dragons',
        challengeId: 10,
        challengeTitle: 'Sanity Check',
        isCorrect: true,
        createdAt: '2026-02-04T01:00:00Z',
    },
    {
        id: 2,
        teamId: 2,
        teamName: 'Cyber Phantoms',
        challengeId: 10,
        challengeTitle: 'Sanity Check',
        isCorrect: true,
        createdAt: '2026-02-04T01:05:00Z',
    },
    {
        id: 3,
        teamId: 1,
        teamName: 'Binary Dragons',
        challengeId: 1,
        challengeTitle: 'Baby Web',
        isCorrect: true,
        createdAt: '2026-02-04T01:30:00Z',
    },
    {
        id: 4,
        teamId: 3,
        teamName: 'Root Access',
        challengeId: 10,
        challengeTitle: 'Sanity Check',
        isCorrect: true,
        createdAt: '2026-02-04T01:10:00Z',
    },
    {
        id: 5,
        teamId: 1,
        teamName: 'Binary Dragons',
        challengeId: 4,
        challengeTitle: 'Caesar Cipher',
        isCorrect: false,
        createdAt: '2026-02-04T02:00:00Z',
    },
    {
        id: 6,
        teamId: 1,
        teamName: 'Binary Dragons',
        challengeId: 4,
        challengeTitle: 'Caesar Cipher',
        isCorrect: true,
        createdAt: '2026-02-04T02:05:00Z',
    },
    {
        id: 7,
        teamId: 2,
        teamName: 'Cyber Phantoms',
        challengeId: 1,
        challengeTitle: 'Baby Web',
        isCorrect: true,
        createdAt: '2026-02-04T02:30:00Z',
    },
    {
        id: 8,
        teamId: 1,
        teamName: 'Binary Dragons',
        challengeId: 2,
        challengeTitle: 'SQL Injection 101',
        isCorrect: true,
        createdAt: '2026-02-04T03:00:00Z',
    },
    {
        id: 9,
        teamId: 4,
        teamName: 'Buffer Overflow',
        challengeId: 3,
        challengeTitle: 'XSS Adventure',
        isCorrect: false,
        createdAt: '2026-02-04T03:15:00Z',
    },
    {
        id: 10,
        teamId: 2,
        teamName: 'Cyber Phantoms',
        challengeId: 2,
        challengeTitle: 'SQL Injection 101',
        isCorrect: true,
        createdAt: '2026-02-04T04:00:00Z',
    },
];

// Mock Scoreboard
export const mockScoreboard: ScoreboardEntry[] = mockTeams
    .map((team) => ({
        rank: team.rank || 0,
        teamId: team.id,
        teamName: team.name,
        totalScore: team.totalScore,
        lastSolveTime: team.lastSolveTime || null,
        solvedCount: team.solvedCount || 0,
    }))
    .sort((a, b) => a.rank - b.rank);

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
    totalTeams: mockTeams.length,
    totalUsers: mockUsers.filter((u: CTFUser) => u.role === 'participant').length,
    totalChallenges: mockChallenges.length,
    totalSubmissions: mockSubmissions.length,
    correctSubmissions: mockSubmissions.filter((s) => s.isCorrect).length,
    publishedChallenges: mockChallenges.filter((c) => c.isPublished).length,
};

// Current user mock (participant)
export const mockCurrentUser: CTFUser = mockUsers[1];

// Current team mock
export const mockCurrentTeam: Team = mockTeams[0];
