import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Question } from '../question/question.entity';
import { User } from '../user/user.entity';

export type AsakaiChoices = Record<number, number>;
export interface TotemSimilarity {
    similarity: number;
    sameAnswerCount: number;
    squareNorm: number;
}
export interface Totem {
    user: { userId: number };
    similarity: TotemSimilarity;
}

@Entity('user_to_question_choices')
export class UserToQuestionChoice {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    questionId: number;

    @Column({ nullable: false })
    @Exclude()
    userId: number;

    @ManyToOne(type => Question, question => question.userToQuestionChoices)
    @Exclude()
    question: Question;

    @ManyToOne(type => User, user => user.userToQuestionChoices)
    @Exclude()
    user: User;

    @Column({ nullable: false })
    choice: number;
}
