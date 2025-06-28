import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login() {
    return this.authService.login();
  }

  @Post('/firshLogin')
  firshLogin() {
    return true;
  }

  @Post('/registePassword')
  registerPassword() {
    return true;
  }

  @Post('/alterPassword')
  alterPassword() {
    return true;
  }

}
