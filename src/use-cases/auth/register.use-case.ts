import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from 'src/adapters/inbound/rest/auth/dto/register.dto';
import { PasswordHelper } from 'src/adapters/shared/helpers/password.helper';
import { UserPresenter } from 'src/adapters/shared/presenter/user.presenter';
import { AuthResponse } from 'src/domain/interface/auth-response.interface';
import { UserRepositoryPort } from '../user/user.repository.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponse> {
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('Email sudah digunakan');
    }

    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      password: await PasswordHelper.hash(dto.password),
    });

    return this.buildAuthResponse(user);
  }

  async buildAuthResponse(
    user: Awaited<ReturnType<UserRepositoryPort['save']>>,
  ): Promise<AuthResponse> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn as never,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: UserPresenter.toResponse(user),
    };
  }
}
