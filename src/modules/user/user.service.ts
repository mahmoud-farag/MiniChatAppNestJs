import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';



@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}


    async create(user: Prisma.UserCreateInput) {

        await this.prisma.user.create({
            data: user,
        });

        return user;

    }

    async findUser(where: Prisma.UserWhereUniqueInput) {
        
        const user = await this.prisma.user.findUnique({ where });

        return user;

    }

}
