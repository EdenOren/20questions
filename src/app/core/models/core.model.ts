export interface Question {
    id: number;
    question: string;
    answer: string;
    subject: string;
    created_at: string;
}

export interface Score {
    score: number;
    time: number;
    created_at?: string;
}

export interface Rank {
    total_players: number;
    rank: number;
}