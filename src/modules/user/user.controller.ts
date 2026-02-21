import { BadRequestException, Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UploadService } from '../upload/upload.service';
import { S3FoldersEnum } from 'src/common/enums';
import type { IRequestWithUser } from 'src/common/inderfaces';
import { v4 as uuidv4 } from 'uuid';



@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService,
    ) { }

    @Get('get-profile-avatar')
    async getProfileAvatar(@Request() req: IRequestWithUser) {

        const currentUser = req.user;

        const result = await this.userService.getProfileAvatar({ currentUser });

        return { message: 'Profile avatar fetched successfully', data: result };

    }

    @Get('get-profile')
    async getProfile(@Request() req: IRequestWithUser) {

        const user = req.user;

        const result = await this.userService.getUserProfile({ user });

        return { message: 'Profile fetched successfully', data: result };

    }

    @Get('all')
    async getUsers(@Request() req: IRequestWithUser) {

        const loggedUser = req.user;
        const users = await this.userService.getUsers({ user: loggedUser });

        return { message: 'Users fetched successfully', data: users };

    }

    @Post('avatar/presigned-url')
    async getAvatarPresignedUrl(@Request() req: IRequestWithUser, @Body() body: { fileName: string; contentType: string }) {

        const folder = S3FoldersEnum.AVATARS_IMAGES;
        const currentUser = req.user;


        if (!body.fileName || !body.contentType)
            throw new BadRequestException('File name and content type are required');

        const fileName = body.fileName;
        const normalizedFileName = `${uuidv4()}-${fileName}`;

        // *) get the presigned upload url
        const { uploadUrl } = await this.uploadService.getPresignedUploadUrl(
            { fileName: normalizedFileName, folder, contentType: body.contentType },
            { expiresIn: 24 * 60 * 60 },
        );


        // *) delete the previous avatar if exists
        await this.userService.deletePrevAvatar({ currentUser });

        // *) update the user profile with the new avatar
        await this.userService.updateUserProfile({ currentUser, updatedFields: { avatarS3FileName: normalizedFileName, avatarS3Folder: folder } });

        return { message: 'Presigned URL generated successfully', data: { uploadUrl } };

    }

}
