import { Repository, EntityRepository } from 'typeorm'
import { UserToQuestionVote } from './userToQuestionVote.entity'

@EntityRepository(UserToQuestionVote)
export class UserToQuestionVoteRepository extends Repository<UserToQuestionVote> {}
