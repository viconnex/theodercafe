import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionSetService } from './questionSet.service'
import { QuestionSetController } from './questionSet.controller'
import { QuestionSetRepository } from './questionSet.repository'

@Module({
    imports: [TypeOrmModule.forFeature([QuestionSetRepository])],
    controllers: [QuestionSetController],
    providers: [QuestionSetService],
    exports: [QuestionSetService],
})
export class QuestionSetModule {}
