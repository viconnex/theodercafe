import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './questions.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsDto } from './interfaces/questions.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class QuestionsService {
    constructor(@InjectRepository(QuestionRepository) private readonly questionRepository: QuestionRepository) {}

    create(questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionRepository.createQuestion(questionsDto);
    }

    findAll(): Promise<QuestionsDto[]> {
        return this.questionRepository.find();
    }

    findOne(id: string): Promise<QuestionsDto> {
        return this.questionRepository.findOneQuestion(id);
    }

    update(id: string, questionsDto: QuestionsDto): Promise<QuestionsDto> {
        return this.questionRepository.updateQuestion(id, questionsDto);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.questionRepository.deleteQuestion(id);
    }
}
