import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtStrategy],
    imports: [UserModule],
})
export class AuthModule {}
