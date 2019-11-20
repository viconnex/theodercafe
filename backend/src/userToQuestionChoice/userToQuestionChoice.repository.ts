import { Repository, EntityRepository } from 'typeorm';
import { UserToQuestionChoice } from './userToQuestionChoice.entity';

@EntityRepository(UserToQuestionChoice)
export class UserToQuestionChoiceRepository extends Repository<UserToQuestionChoice> {}
