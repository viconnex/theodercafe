import { Body, Controller, Delete, Get, NotFoundException, Param, Put, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { ADMIN_STRATEGY } from 'src/auth/jwt.admin.strategy'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/user.entity'
import { DeleteResult } from 'typeorm'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async getAdminList(@Res() res: Response): Promise<void> {
        const result = await this.userService.findAdminList()
        res.set('Access-Control-Expose-Headers', 'X-Total-Count')
        res.set('X-Total-Count', result.length.toString())
        res.send(result)
    }

    @Get(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async findOne(@Param('id') id: string): Promise<User> {
        const question = await this.userService.findOne(id)
        if (!question) {
            throw new NotFoundException()
        }

        return question
    }

    @Delete(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    async remove(@Param('id') id: string): Promise<DeleteResult> {
        const deleteResult = await this.userService.delete(id)
        if (deleteResult.affected === 0) {
            throw new NotFoundException()
        }

        return deleteResult
    }

    @Put(':id')
    @UseGuards(AuthGuard(ADMIN_STRATEGY))
    updateQuestion(@Param('id') id: number, @Body() questionBody): Promise<User> {
        return this.userService.update(id, questionBody)
    }
}
