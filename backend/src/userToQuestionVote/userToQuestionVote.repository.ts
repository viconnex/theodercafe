import { EntityRepository, Repository } from 'typeorm'
import { QuestionVote } from './types'
import { UserToQuestionVote } from './userToQuestionVote.entity'

@EntityRepository(UserToQuestionVote)
export class UserToQuestionVoteRepository extends Repository<UserToQuestionVote> {
    getQuestionsVotes = (userId: number) => {
        if (typeof userId !== 'number') {
            throw new Error('the userId must be a number in getQuestionsPolls')
        }

        return this.query(`
            SELECT "questions"."id" as "questionId", "up_vote_count" as "upVoteCount", "down_vote_count" as "downVoteCount", "isUpVote" as "isUserUpVote"
            FROM questions
            LEFT JOIN (
            SELECT
                "questionId",
                SUM(CASE when "isUpVote" = true then 1 else 0 end) as up_vote_count,
                SUM(CASE when "isUpVote" = false then 1 else 0 end) as down_vote_count
            FROM user_to_question_votes
            GROUP BY "questionId"
            ) AS user_to_question_votes
            ON questions.id = "user_to_question_votes"."questionId"
            LEFT JOIN (
                SELECT "questionId", "isUpVote"
                FROM user_to_question_votes
                WHERE "user_to_question_votes"."userId" = ${userId}
            ) AS u_to_q_votes
            ON questions.id = "u_to_q_votes"."questionId"
            ORDER BY "questions"."id" ASC;
        `) as Promise<QuestionVote[]>
    }
}
