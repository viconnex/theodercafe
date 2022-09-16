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

// eslint-disable-next-line no-shadow
export enum PresetQuestionSet {
    TheodoFR = 'Theodo FR',
    TheodoUS = 'Theodo US',
    TheodoUK = 'Theodo UK',
}

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
