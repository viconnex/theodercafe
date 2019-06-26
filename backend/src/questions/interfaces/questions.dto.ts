import { Categories } from 'src/categories/categories.entity';

export class QuestionsDto {
    readonly category: Categories;
    readonly option1: string;
    readonly option2: string;
}
