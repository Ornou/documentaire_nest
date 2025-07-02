import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ secret: process.env.JWT_SECRET || 'secret', signOptions: { expiresIn: '1d' } })],
  providers: [AuthService, AuthResolver, UserService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
