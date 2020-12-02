import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Category } from '../category/category.entity'
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity'
import { UserToQuestionVote } from '../userToQuestionVote/userToQuestionVote.entity'

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne((type) => Category, (category) => category.question)
    category: Category

    @Column()
    option1: string

    @Column()
    option2: string

    @Column({ default: false })
    isClassic: boolean

    @Column({ default: false })
    isJokeOnSomeone: boolean

    @Column({ nullable: true })
    isValidated: boolean

    @Column({ default: false })
    isJoke: boolean

    @OneToMany((type) => UserToQuestionChoice, (userToQuestionChoice) => userToQuestionChoice.question, {
        cascade: true,
    })
    userToQuestionChoices: UserToQuestionChoice[]

    @OneToMany((type) => UserToQuestionVote, (userToQuestionVote) => userToQuestionVote.question, { cascade: true })
    userToQuestionVotes: UserToQuestionChoice[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}
