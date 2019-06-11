import { Question } from './questions.entity';
import { EntityRepository, Repository } from 'typeorm';
import { QuestionDto } from './interfaces/questions.dto';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
    public createQuestion = async (questionDto: QuestionDto): Promise<QuestionDto & Question> => {
        return await this.save(questionDto);
    };
}
