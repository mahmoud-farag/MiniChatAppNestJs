import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, SigninUserDto } from 'src/common/dtos';
import { comparePassword, hashPassword } from 'src/common/utilities';
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
            throw new BadRequestException("Email already exists");

        const hashedPassword = await hashPassword(reqBody.password);

        if (hashedPassword)
            reqBody.password = hashedPassword;
        else 
            throw new InternalServerErrorException("Failed to hash password");
        

        const createUser = await this.userService.create(reqBody);

        const accessToken = this.generateAccessToken({ sub: createUser.id, email: createUser.email });

        return { user: createUser, accessToken };
    }

    async signin(reqBody: SigninUserDto) {

        if (!reqBody?.email)
            throw new BadRequestException("Email is missing");

        if (!reqBody?.password)
            throw new BadRequestException("Password is missing");
        
        const user = await this.userService.findUser({email: reqBody.email});

        if (!user)
            throw new NotFoundException("Invalid credentials");

        const isPasswordMatched = await comparePassword(reqBody.password, user.password);

        if (!isPasswordMatched)
            throw new BadRequestException("Invalid credentials");

        const { password: _, ...userWithoutPassword } = user;
        const accessToken = this.generateAccessToken({ sub: user.id, email: user.email });

        return { user: userWithoutPassword, accessToken };
    }

    private generateAccessToken( payload: { sub: string; email: string }): string {

        const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email });        
        
        return accessToken;    
    }

}
