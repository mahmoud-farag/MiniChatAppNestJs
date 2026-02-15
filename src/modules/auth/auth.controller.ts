import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SigninUserDto } from 'src/common/dtos';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post('sign-up')
    signup(@Body() reqBody: CreateUserDto) {
        return this.authService.signup(reqBody);
    }

    @Post('sign-in')
    signin(@Body() reqBody: SigninUserDto){
        return this.authService.signin(reqBody);
    }
}
