import { Category } from 'src/categories/category.entity';

export class QuestionDto {
    readonly category: Category;
    readonly option1: string;
    readonly option2: string;
}
