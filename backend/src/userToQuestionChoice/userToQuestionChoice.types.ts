export type AsakaiChoices = Record<number, number>;
export interface AlterodoSimilarity {
    similarity: number;
    sameAnswerCount: number;
    squareNorm: number;
}
export interface Alterodo {
    user: { userId: number };
    similarity: AlterodoSimilarity;
}
export interface AlterodoResponse {
    user: { givenName: string; familyName: string; pictureUrl: string; email: string };
    similarity: AlterodoSimilarity;
}
