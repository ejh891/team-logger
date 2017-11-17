export interface PostBody {
    id?: string;
    userId: string;
    rating: number;
    comment: string;
    timestamp: number;
    usersWhoLikeThis: string[]
}