import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterPasswordDto } from './dto/register-password.dto';
import { FirshLoginDto } from './dto/firsh-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/verifyFirshLogin')
  verifyFirshLogin(@Body() firshLoginDto: FirshLoginDto) {
    return this.authService.verifyFirshLogin(firshLoginDto);
  }

  @Post('/registerPassword')
  registerPassword(@Body() registerPasswordDto: RegisterPasswordDto) {
    return this.authService.registerPassword(registerPasswordDto);
  }

  @Post('/alterPassword')
  alterPassword() {
    return true;
  }

}
