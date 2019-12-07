import { Category } from 'src/category/category.entity';

export class QuestionDto {
    readonly id: number;
    readonly category: Category;
    readonly option1: string;
    readonly option2: string;
    readonly option1Votes: number;
    readonly option2Votes: number;
}
