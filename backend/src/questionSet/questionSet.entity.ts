import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Question } from '../question/question.entity'

@Entity('question_set')
export class QuestionSet {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToMany(() => Question, (question) => question.questionSets)
    @JoinTable({ name: 'question_set_questions' })
    questions: Question[]
}
