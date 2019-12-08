import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Question } from '../question/question.entity';
import { User } from '../user/user.entity';

@Entity('user_to_question_votes')
export class UserToQuestionVote {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    questionId: number;

    @Column({ nullable: false })
    @Exclude()
    userId: number;

    @ManyToOne(type => Question, question => question.userToQuestionVotes)
    @Exclude()
    question: Question;

    @ManyToOne(type => User, user => user.userToQuestionVotes)
    @Exclude()
    user: User;

    @Column({ nullable: false })
    isUpVote: boolean;
}
