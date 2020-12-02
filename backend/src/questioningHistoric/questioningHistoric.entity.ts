import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('questioning_historic')
export class QuestioningHistoric {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column({ type: 'timestamp' })
    date: Date

    @Column({ type: 'simple-array' })
    questioning: string[]
}
