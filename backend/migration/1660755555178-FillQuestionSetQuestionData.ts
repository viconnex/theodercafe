import { MigrationInterface, QueryRunner } from 'typeorm'
import { Question } from '../src/question/question.entity'
import { QuestionSet } from '../src/questionSet/questionSet.entity'

export class FillQuestionSetQuestionData1660755555178 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const questionSetRepository = queryRunner.connection.getRepository(QuestionSet)
        const questionRepository = queryRunner.connection.getRepository(Question)

        const questions = await questionRepository.find()
        const questionSet = await questionSetRepository.save({ name: 'Theodo FR' })
        questionSet.questions = questions
        await questionSetRepository.save(questionSet)
    }

    public async down(): Promise<any> {
        return Promise.resolve()
    }
}
