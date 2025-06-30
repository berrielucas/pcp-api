import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterPasswordDto } from './dto/register-password.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import { FirshLoginDto } from './dto/firsh-login.dto';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);

    if (user) {
      if (await this.hashingService.compare(password, user.password)) {
        const { password, ...partialUser } = user;
        return partialUser;
      }
      throw new UnauthorizedException("Email ou Senha inválidos");
    }

  }

  async registerPassword(registerPasswordDto: RegisterPasswordDto) {
    const { email, password, confirm_password } = registerPasswordDto;

    if (password !== confirm_password) {
      throw new BadRequestException("Os campos `password` e `confirm_password` precisam ser iguais.");
    }

    const user = await this.userService.findOneByEmail(email);

    if (user) {
      if (!user.firsh_login) {
        throw new UnauthorizedException("Esse usuário já possui uma senha cadastrada, favor realizar o login.");
      }

      const new_user_data = await this.userService.update(user.id, { password });

      if (new_user_data) {
        const { password, ...partialUser } = new_user_data;
        return partialUser;
      }
    }
  }

  async verifyFirshLogin(firshLoginDto: FirshLoginDto) {
    const user = await this.userService.findOneByEmail(firshLoginDto.email);
    if (user) {
      if (user.firsh_login) return { firsh_login: true };
      return { firsh_login: false };
    }
  }
}
