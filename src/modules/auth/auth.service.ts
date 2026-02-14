import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, SigninUserDto } from 'src/common/dtos';
import { comparePassword, hashPassword } from 'src/common/utilites';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(reqBody: CreateUserDto) {


        const user = await this.userService.findUser({email: reqBody.email});

        if (user) 
            throw new BadRequestException("User already exists");

        const hashedPassword = await hashPassword(reqBody.password);

        if (hashedPassword)
            reqBody.password = hashedPassword;
        else 
            throw new InternalServerErrorException("Failed to hash password");
        

        const result = await this.userService.create(reqBody);

        return { result };
    }

    async signin(reqBody: SigninUserDto) {

        if (!reqBody?.email || !reqBody?.password)
            throw new BadRequestException("Email or password is missing");
        
        const user = await this.userService.findUser({email: reqBody.email});

        if (!user)
            throw new NotFoundException("User not found");

        const isPasswordMatched = await comparePassword(reqBody.password, user.password);

        if (!isPasswordMatched)
            throw new BadRequestException("Invalid credentials");

        const accessToken = this.generateAccessToken({ sub: user.id, email: user.email });

        return { user, accessToken };
    }

    private generateAccessToken( payload: { sub: string; email: string }): string {

        const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email });        
        
        return accessToken;    
    }

    logout() {
        return "logout";
    }
}
