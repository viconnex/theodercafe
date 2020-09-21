import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/user.entity'
import { UserEmailPostBody } from 'src/user/user.types'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() userEmailBody: UserEmailPostBody): Promise<User> {
        if (!userEmailBody.email) {
            throw new BadRequestException('you must provide an email address')
        }
        return this.userService.createUserWithEmail(userEmailBody.email)
    }
}
