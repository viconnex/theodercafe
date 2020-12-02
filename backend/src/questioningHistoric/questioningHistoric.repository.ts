import { EntityRepository, Repository } from 'typeorm'
import { QuestioningHistoric } from './questioningHistoric.entity'

@EntityRepository(QuestioningHistoric)
export class QuestioningHistoricRepository extends Repository<QuestioningHistoric> {}
