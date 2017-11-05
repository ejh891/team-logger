export type NullableFirebaseError = FirebaseError | null;

export interface FirebaseError {
    code: string;
    message: string;
}
