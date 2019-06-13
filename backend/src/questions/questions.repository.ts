import { Questions } from './questions.entity';
import { EntityRepository, Repository, DeleteResult } from 'typeorm';
import { QuestionsDto } from './interfaces/questions.dto';
import { Question } from 'dist/questions/questions.entity';

@EntityRepository(Questions)
export class QuestionRepository extends Repository<Questions> {
    createQuestion = async (questionsDto: QuestionsDto): Promise<QuestionsDto & Questions> => {
        return this.save(questionsDto);
    };

    findOneQuestion = async (id: string): Promise<Questions> => {
        return this.findOne(Number(id));
    };

    updateQuestion = async (id: string, questionsDto: QuestionsDto): Promise<Question> => {
        return this.save({ ...questionsDto, id: Number(id) });
    };

    removeQuestion = async (id: string): Promise<DeleteResult> => {
        return this.delete(Number(id));
    };
}
