import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/adapters/inbound/rest/auth/dto/login.dto';
import { PasswordHelper } from 'src/adapters/shared/helpers/password.helper';
import { AuthResponse } from 'src/domain/interface/auth-response.interface';
import { UserRepositoryPort } from '../user/user.repository.port';
import { RegisterUseCase } from './register.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isValid = await PasswordHelper.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    return this.registerUseCase.buildAuthResponse(user);
  }
}
