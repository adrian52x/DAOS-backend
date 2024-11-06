import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('login')
    async login(@Request() req): Promise<any | BadRequestException> {  // TO DO here
      console.log(req.body);
      
      return this.authService.login(req.user);
    }
    @Post('register')
    async register(
      @Body() registerBody: CreateUserDto,
    ): Promise<CreateUserDto | BadRequestException> {
      return await this.authService.register(registerBody);
    }
}
