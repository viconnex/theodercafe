import { Questions } from './questions.entity';
import { EntityRepository, Repository, DeleteResult } from 'typeorm';
import { QuestionsDto } from './interfaces/questions.dto';

@EntityRepository(Questions)
export class QuestionRepository extends Repository<Questions> {
    createQuestion = async (questionsDto: QuestionsDto | Questions): Promise<QuestionsDto & Questions> => {
        return this.save(questionsDto);
    };

    findOneQuestion = async (id: string): Promise<Questions> => {
        return this.findOne(id);
    };

    updateQuestion = async (id: string, questionsDto: QuestionsDto): Promise<Questions> => {
        return this.save({ ...questionsDto, id: Number(id) });
    };

    deleteQuestion = async (id: string): Promise<DeleteResult> => {
        return this.delete(Number(id));
    };
}
