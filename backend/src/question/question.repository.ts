import { Question } from './question.entity';
import { EntityRepository, Repository, DeleteResult } from 'typeorm';
import { QuestionDto } from './interfaces/question.dto';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    createQuestion = async (questionDto: QuestionDto | Question): Promise<QuestionDto & Question> => {
        return this.save(questionDto);
    };

    findOneQuestion = async (id: string): Promise<Question> => {
        return this.findOne(id);
    };

    updateQuestion = async (id: string, questionDto: QuestionDto): Promise<Question> => {
        return this.save({ ...questionDto, id: Number(id) });
    };

    deleteQuestion = async (id: string): Promise<DeleteResult> => {
        return this.delete(Number(id));
    };
}
