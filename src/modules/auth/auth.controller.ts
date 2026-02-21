import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, SigninUserDto } from 'src/common/dtos';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('signUp')
    async signup(@Body() reqBody: CreateUserDto) {
        const response = await this.authService.signup(reqBody);

        return { message: "User signed up successfully", data: response };
    }

    @Public()
    @Post('signIn')
    async signin(@Body() reqBody: SigninUserDto) {
        const response = await this.authService.signin(reqBody);

        return { message: "User signed in successfully", data: response };
    }
}
