import { Exclude } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { Question } from '../question/question.entity'
import { User } from '../user/user.entity'

@Entity('user_to_question_choices')
export class UserToQuestionChoice {
    @PrimaryGeneratedColumn()
    public id: number

    @Column({ nullable: false })
    questionId: number

    @Column({ nullable: false })
    @Exclude()
    userId: number

    @ManyToOne(
        () => Question,
        question => question.userToQuestionChoices,
        { onDelete: 'CASCADE' },
    )
    @Exclude()
    question: Question

    @ManyToOne(
        () => User,
        user => user.userToQuestionChoices,
        { onDelete: 'CASCADE' },
    )
    @Exclude()
    user: User

    @Column({ nullable: false })
    choice: number
}
