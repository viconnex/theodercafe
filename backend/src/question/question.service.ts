import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CategoryRepository } from '../category/category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDto } from './interfaces/question.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserToQuestionChoiceService } from '../userToQuestionChoice/userToQuestionChoice.service';
import { Question } from './question.entity';
import { UserToQuestionChoice } from '../userToQuestionChoice/userToQuestionChoice.entity';
import { User } from '../user/user.entity';

const JOKE_ON_SOMEONE_PROBABILITY = 0.7;

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository,
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository,
        private readonly userToQuestionChoiceService: UserToQuestionChoiceService,
    ) {}

    async create(questionBody): Promise<QuestionDto> {
        let category = null;
        if (typeof questionBody.category === 'number') {
            category = await this.categoryRepository.findOne(questionBody.category);
        } else if (typeof questionBody.category === 'string') {
            category = this.categoryRepository.create({ name: questionBody.category });
            try {
                await this.categoryRepository.save(category);
            } catch (err) {
                throw new HttpException(
                    {
                        status: 'error',
                        error: 'The category could not be saved, maybe it already exists',
                    },
                    500,
                );
            }
        }
        const question = this.questionRepository.create({
            category,
            option1: questionBody.option1,
            option2: questionBody.option2,
            isClassic: false,
        });

        return this.questionRepository.save(question);
    }

    async findAsakaiSet(maxNumber: number): Promise<QuestionDto[]> {
        const countClassics = await this.questionRepository.countClassics();
        const jokeAboutSomeoneCount =
            Math.random() < JOKE_ON_SOMEONE_PROBABILITY && maxNumber - countClassics[0].count > 0 ? 1 : 0;
        const standardQuestionCount = Math.max(maxNumber - countClassics[0].count - jokeAboutSomeoneCount, 0);

        return this.questionRepository.findAsakaiSet(standardQuestionCount, jokeAboutSomeoneCount);
    }

    findInOrder(orderedIds: number[]): Promise<QuestionDto[]> {
        return this.questionRepository.findInOrder(orderedIds);
    }

    findAll(): Promise<QuestionDto[]> {
        return this.questionRepository.findAll();
    }

    findAdminList(): Promise<QuestionDto[]> {
        return this.questionRepository.findAdminList();
    }

    findOne(id: string): Promise<QuestionDto> {
        return this.questionRepository.findOneQuestion(id);
    }

    update(id: string | number, questionDto: QuestionDto): Promise<QuestionDto> {
        return this.questionRepository.updateQuestion(id, questionDto);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.questionRepository.deleteQuestion(id);
    }

    async upVote(questionId: number, isUpvote: boolean): Promise<UpdateResult> {
        const question = await this.questionRepository.findOne(questionId);
        if (isUpvote) {
            return this.questionRepository.update(questionId, { upVotes: question.upVotes + 1 });
        }

        return this.questionRepository.update(questionId, { downVotes: question.downVotes + 1 });
    }

    async saveUserToQuestionChoice(questionId: number, user: User, choice: number): Promise<UserToQuestionChoice> {
        const question: Question = await this.questionRepository.findOne(questionId);
        if (!question) {
            throw new NotFoundException('question id not found');
        }

        this.updateQuestionChoice(question, choice);

        return this.userToQuestionChoiceService.saveChoice(question, user, choice);
    }

    updateQuestionChoice(question: Question, choice: number): void {
        if (choice === 1) {
            this.questionRepository.update(question.id, { option1Votes: question.option1Votes + 1 });
        } else if (choice === 2) {
            this.questionRepository.update(question.id, { option2Votes: question.option2Votes + 1 });
        }
    }
}
