import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserToQuestionChoiceModule } from '../userToQuestionChoice/userToQuestionChoice.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository]), UserToQuestionChoiceModule],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
