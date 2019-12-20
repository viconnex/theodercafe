export type AsakaiChoices = Record<number, number>;
export interface AlterodoSimilarity {
    similarity: number;
    sameAnswerCount: number;
    commonQuestionCount: number;
}
export interface Alterodo {
    user: { userId: number };
    similarity: AlterodoSimilarity;
}

interface UserAlterodoResponse {
    givenName: string;
    familyName: string;
    pictureUrl: string;
}

export interface AlterodoResponse {
    alterodo: {
        user: UserAlterodoResponse;
        similarity: AlterodoSimilarity;
    };
    varieto: {
        user: UserAlterodoResponse;
        similarity: AlterodoSimilarity;
    };
}

export interface Totems {
    alterodo: SimilarityWithUser;
    varieto: SimilarityWithUser;
}

export interface SimilarityWithUser {
    userId: number;
    commonQuestionCount: number;
    sameAnswerCount: number;
    similarity?: number;
}
