import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity'
import { UserToQuestionVote } from '../userToQuestionVote/userToQuestionVote.entity'

export const getCompanyFromEmail = (email: string): string => {
    return email.split('@')[1].split('.')[0]
}

export const THEODO_COMPANY = 'theodo'

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

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    addedByUser: User | null

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    asakaiAlterodoUser: User | null

    @Column({ default: false })
    @Exclude()
    isAdmin: boolean

    @Column({ default: true })
    @Exclude()
    isActive: boolean

    @Column({ default: false })
    @Exclude()
    isLoginPending: boolean

    @OneToMany(() => UserToQuestionChoice, (userToQuestionChoice) => userToQuestionChoice.user, { cascade: true })
    userToQuestionChoices: UserToQuestionChoice[]

    @OneToMany(() => UserToQuestionVote, (userToQuestionVote) => userToQuestionVote.user, { cascade: true })
    userToQuestionVotes: UserToQuestionVote[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}
