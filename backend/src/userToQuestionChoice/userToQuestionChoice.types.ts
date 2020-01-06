export type AsakaiChoices = Record<number, number>;

interface UserAlterodoResponse {
    givenName: string;
    familyName: string;
    pictureUrl: string;
}

export interface AlterodoResponse {
    baseQuestionCount: number;
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

export type UsersMap = [number, number][];

export interface UserMapResponse {
    map: UsersMap;
}
