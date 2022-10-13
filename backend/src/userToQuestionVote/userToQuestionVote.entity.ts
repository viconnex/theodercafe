import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Question } from '../question/question.entity'
import { User } from '../user/user.entity'

@Entity('user_to_question_votes')
export class UserToQuestionVote {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({ nullable: false })
    questionId: number

    @Column({ nullable: false })
    @Exclude()
    userId: number

    @ManyToOne(() => Question, (question) => question.userToQuestionVotes, { onDelete: 'CASCADE' })
    @Exclude()
    question: Question

    @ManyToOne(() => User, (user) => user.userToQuestionVotes, { onDelete: 'CASCADE' })
    @Exclude()
    user: User

    @Column({ nullable: false })
    isUpVote: boolean
}
