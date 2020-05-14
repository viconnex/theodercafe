import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './google.strategy'
import { JwtAdminStrategy } from './jwt.admin.strategy'
import { UserModule } from '../user/user.module'
import { JwtRegisteredUserStrategy } from './jwt.user.strategy'

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtAdminStrategy, JwtRegisteredUserStrategy],
    imports: [UserModule],
})
export class AuthModule {}
