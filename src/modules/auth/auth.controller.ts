import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SigninUserDto } from 'src/common/dtos';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('sign-up')
    signup(@Body() reqBody: CreateUserDto) {
        return this.authService.signup(reqBody);
    }

    @Public()
    @Post('sign-in')
    signin(@Body() reqBody: SigninUserDto){
        return this.authService.signin(reqBody);
    }
}
