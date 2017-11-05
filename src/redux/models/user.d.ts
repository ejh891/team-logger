export interface User {
    id: string;
    name: string;
    photoURL: string;
}

export type NullableUser = User | null;
