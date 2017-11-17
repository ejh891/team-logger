export interface DraftPostBody {
    userId: string;
    rating: number;
    comment: string;
    timestamp: number;
}

export interface RatifiedPostBody extends DraftPostBody {
    id: string;
    usersWhoLikeThis: string[]
}