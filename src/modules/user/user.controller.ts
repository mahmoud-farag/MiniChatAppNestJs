import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import type { IRequestWithUser } from 'src/common/inderfaces';



@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('get-profile-avatar')
    async getProfileAvatar(@Request() req: IRequestWithUser) {

        const loggedUser = req.user;

        const result = await this.userService.getProfileAvatar({ user: loggedUser });

        return { message: "Profile avatar fetched successfully", data: result };

    }

    @Get('get-profile')
    async getProfile(@Request() req: IRequestWithUser) {

        const user = req.user;

        const result = await this.userService.getUserProfile({ user });

        return { message: "Profile fetched successfully", data: result };

    }

    @Get('all')
    async getUsers(@Request() req: IRequestWithUser) {

        const loggedUser = req.user;
        const users = await this.userService.getUsers({ user: loggedUser });

        return { message: "Users fetched successfully", data: users };

    }


}
