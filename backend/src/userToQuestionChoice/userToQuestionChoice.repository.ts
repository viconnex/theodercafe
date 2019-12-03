import { Repository, EntityRepository } from 'typeorm';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {
    findByQuestionIds = (questionIds): Promise<UserToQuestionChoice[]> => {
        return this.createQueryBuilder('user_to_question_choices')
            .leftJoin('user_to_question_choices.user', 'user')
            .where('user.company IN (:...companies)', { companies: ['theodo', 'gmail'] })
            .andWhere('user_to_question_choices.questionId IN (:...questionIds)', { questionIds })
            .getMany();
    };
}
