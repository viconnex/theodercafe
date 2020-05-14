import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity'
import { Exclude } from 'class-transformer'
import { UserToQuestionVote } from '../userToQuestionVote/userToQuestionVote.entity'

export const getCompanyFromEmail = (email: string): string => {
    return email.split('@')[1].split('.')[0]
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    givenName: string

    @Column({ nullable: true })
    familyName: string

    @Column({ nullable: true })
    company: string

    @Column({ nullable: true })
    pictureUrl: string

    @Column({ default: false })
    @Exclude()
    isAdmin: boolean

    @OneToMany(
        type => UserToQuestionChoice,
        userToQuestionChoice => userToQuestionChoice.user,
        { cascade: true },
    )
    userToQuestionChoices: UserToQuestionChoice[]

    @OneToMany(
        type => UserToQuestionVote,
        userToQuestionVote => userToQuestionVote.user,
        { cascade: true },
    )
    userToQuestionVotes: UserToQuestionVote[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}
