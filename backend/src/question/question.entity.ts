import { User } from 'src/user/user.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Category } from '../category/category.entity'
import { QuestionSet } from '../questionSet/questionSet.entity'
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity'
import { UserToQuestionVote } from '../userToQuestionVote/userToQuestionVote.entity'

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, (category) => category.question)
    category: Category | null

    @Column({ nullable: true })
    categoryId: number

    @Column()
    option1: string

    @Column()
    option2: string

    @Column({ default: false })
    isClassic: boolean

    @Column({ default: false })
    isJokeOnSomeone: boolean

    @Column({ nullable: true, type: 'boolean' })
    isValidated: boolean | null

    @Column({ default: false })
    isJoke: boolean

    @OneToMany(() => UserToQuestionChoice, (userToQuestionChoice) => userToQuestionChoice.question, {
        cascade: true,
    })
    userToQuestionChoices: UserToQuestionChoice[]

    @OneToMany(() => UserToQuestionVote, (userToQuestionVote) => userToQuestionVote.question, { cascade: true })
    userToQuestionVotes: UserToQuestionVote[]

    @ManyToMany(() => QuestionSet, (questionSet) => questionSet.questions)
    questionSets: QuestionSet[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    addedByUser: User | null

    @Column({ nullable: true })
    addedByUserId: number | null
}
