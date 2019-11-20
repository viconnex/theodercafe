import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Question } from '../question/question.entity';
import { User } from '../user/user.entity';

@Entity('user_to_question_choices')
export class UserToQuestionChoice {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    questionId: number;

    @Column({ nullable: false })
    userId: number;

    @ManyToOne(type => Question, question => question.userToQuestionChoices)
    question: Question;

    @ManyToOne(type => User, user => user.userToQuestionChoices)
    user: User;

    @Column({ nullable: false })
    choice: number;
}
