import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { QuestionSet } from '../questionSet/questionSet.entity'

@Entity('questioning_historic')
export class QuestioningHistoric {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column({ type: 'timestamp' })
    date: Date

    @Column({ type: 'simple-array' })
    questioning: string[]

    @ManyToOne(() => QuestionSet, { onDelete: 'SET NULL', nullable: true })
    questionSet: QuestionSet | null
}
