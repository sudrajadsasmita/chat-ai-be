import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserTypeormRepository } from 'src/infrastructure/user.typeorm.repository';
import { UserOrm } from 'src/infrastructure/typeorm/user.entity.orm';
import { UserRepositoryPort } from 'src/use-cases/user/user.repository.port';
import { RegisterUseCase } from 'src/use-cases/auth/register.use-case';
import { LoginUseCase } from 'src/use-cases/auth/login.use-case';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrm]),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'change-me-in-production'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: UserTypeormRepository,
    },
    RegisterUseCase,
    LoginUseCase,
  ],
  exports: [JwtModule, UserRepositoryPort, RegisterUseCase, LoginUseCase],
})
export class AuthModule {}
