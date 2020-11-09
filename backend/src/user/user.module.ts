import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuestionModule } from 'src/question/question.module'
import { UserController } from 'src/user/user.controller'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User, UserRepository]), QuestionModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
