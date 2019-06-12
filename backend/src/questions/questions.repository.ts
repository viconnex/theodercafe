import { Questions } from './questions.entity';
import { EntityRepository, Repository } from 'typeorm';
import { QuestionDto } from './interfaces/questions.dto';

@EntityRepository(Questions)
export class QuestionRepository extends Repository<Questions> {
    public createQuestion = async (questionDto: QuestionDto): Promise<QuestionDto & Questions> => {
        return await this.save(questionDto);
    };
}
