import { EntityRepository, Repository } from 'typeorm'
import { Accumulus } from './accumulus.entity'

@EntityRepository(Accumulus)
export class AccumulusRepository extends Repository<Accumulus> {}
