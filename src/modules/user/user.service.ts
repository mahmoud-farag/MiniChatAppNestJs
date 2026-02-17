import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { IUser } from 'src/common/inderfaces';



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

    async findUser({ where, select, omit }: {where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect, omit?: Prisma.UserSelect } ) {
        
        const query: Prisma.UserFindUniqueArgs =  { where };

        if (select) 
            query.select = select;

        if (omit)
            query.omit = omit;

        const user = await this.prisma.user.findUnique(query);

        return user;

    }

    async findUsers({ where, select, omit }: {where: Prisma.UserWhereInput, select?: Prisma.UserSelect, omit?: Prisma.UserSelect } ) {
        
        const query: Prisma.UserFindManyArgs =  { where };

        if (select) 
            query.select = select;

        if (omit)
            query.omit = omit;

        const users = await this.prisma.user.findMany(query);

        return users;

    }


    async getProfileAvatar({ user }: { user: Prisma.UserWhereUniqueInput }): Promise<{signedUrl: string}>{ 


        const params = {
            where: { id: user.id },
            select: { avatarS3FileName: true, avatarS3Folder: true }
        };

        const userInfo = await this.findUser(params);


        if (!userInfo?.avatarS3FileName || !userInfo?.avatarS3Folder) {
            throw new BadRequestException('S3 file name and folder not found');
        }

        const fileName = userInfo.avatarS3FileName;
        const folder = userInfo.avatarS3Folder;

        const { signedUrl } = await this.uploadService.getPresignedReadUrl({ fileName, folder }, { expiresIn: 24 * 60 * 60 });

        return { signedUrl };

    }

    async getUserProfile({ user }: { user: Prisma.UserWhereUniqueInput }): Promise<IUser> {

        const params = {
            where: { id: user.id },
            select: { avatarS3FileName: true, avatarS3Folder: true }
        };

        const userInfo = await this.findUser(params);

        return userInfo as IUser;

    }


    async getUsers({ user }: { user: Prisma.UserWhereUniqueInput }):Promise<IUser[]> {

        // Get All users expect the logged user
        const params = {
            where: { id: { not : user.id} },
        };

        const users = await this.findUsers(params);

        return users as IUser[];

    }


}
