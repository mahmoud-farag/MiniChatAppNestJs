import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Request as ExpressRequest } from 'express';


interface RequestWithUser extends ExpressRequest {
    user: Prisma.UserWhereUniqueInput;
};

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('get-profile-avatar')
    async getProfileAvatar(@Request() req: RequestWithUser) {

        const loggedUser = req.user;

        const result = await this.userService.getProfileAvatar({user: loggedUser});

        return result;

    }

    @Get('get-profile')
    async getProfile(@Request() req: RequestWithUser) {

        const user = req.user;

        const result = await this.userService.getUserProfile({user});

        return result;

    }

    @Get('all')
    async getUsers(@Request() req: RequestWithUser) {

        const loggedUser = req.user;
        const users = await this.userService.getUsers({user: loggedUser});

        return users;

    }


}
