import { Category } from 'src/categories/category.entity';

export class QuestionsDto {
    readonly category: Category;
    readonly option1: string;
    readonly option2: string;
}
