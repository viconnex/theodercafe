import { EntityRepository, Repository } from 'typeorm'
import { QuestionSet } from './questionSet.entity'

@EntityRepository(QuestionSet)
export class QuestionSetRepository extends Repository<QuestionSet> {}
