import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UploadService } from '../upload/upload.service';



@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService, 
        private readonly uploadService: UploadService,
    ) {}


    async create(user: Prisma.UserCreateInput) {

       const {password: _, ...createdUser} =  await this.prisma.user.create({
            data: user,
        });


        return createdUser;

    }

    async findUser(where: Prisma.UserWhereUniqueInput) {
        
        const user = await this.prisma.user.findUnique({ where });

        return user;

    }


    async getProfileAvatar({user}: {user: Prisma.UserWhereUniqueInput}){ 


        const userInfo = await this.findUser({id: user.id});

        const avatarS3Info = userInfo?.profilePic;

        // const fileName = avatarS3Info?.fileName;
        // const folder = avatarS3Info?.folder;

        const result = await this.uploadService.getPresignedReadUrl({fileName: 'test', folder: 'test'}, { expiresIn: 60 * 60 });

        return result;

    }

}
