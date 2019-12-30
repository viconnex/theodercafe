export type AsakaiChoices = Record<number, number>;

interface UserAlterodoResponse {
    givenName: string;
    familyName: string;
    pictureUrl: string;
}

export interface AlterodoResponse {
    alterodo: SimilarityWithUserId & UserAlterodoResponse;
    varieto: SimilarityWithUserId & UserAlterodoResponse;
}

export interface Alterodos {
    alterodo: SimilarityWithUserId;
    varieto: SimilarityWithUserId;
}

export interface SimilarityWithUserId {
    userId: number;
    commonQuestionCount: number;
    sameAnswerCount: number;
    similarity: number;
}
