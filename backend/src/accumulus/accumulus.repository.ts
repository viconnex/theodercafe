import { Accumulus } from './accumulus.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Accumulus)
export class AccumulusRepository extends Repository<Accumulus> {}
