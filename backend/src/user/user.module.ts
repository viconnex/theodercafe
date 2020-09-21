import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from 'src/user/user.controller'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
