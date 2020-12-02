import { EntityRepository, Repository } from 'typeorm'
import { UserToQuestionVote } from './userToQuestionVote.entity'

@EntityRepository(UserToQuestionVote)
export class UserToQuestionVoteRepository extends Repository<UserToQuestionVote> {}
