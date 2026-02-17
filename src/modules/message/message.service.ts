import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MessageService {
    
    constructor(private readonly prisma: PrismaService) {}
    


    async findManyWithoutPagination ({ where, select, omit }: { where: Prisma.MessageWhereInput, select?: Prisma.MessageSelect, omit?: Prisma.MessageSelect } ) {

        const query: Prisma.MessageFindManyArgs = { where };

        if (select)
            query.select = select;

        if (omit)
            query.omit = omit;

        const messages =  await this.prisma.message.findMany(query);

        return messages;
    }

    async getMessages({ loggedUser, receiverId }: { loggedUser: Prisma.UserWhereUniqueInput, receiverId: string }) {
        

        const where = {
            OR: [
                { senderId: loggedUser.id, receiverId },
                { senderId: receiverId, receiverId: loggedUser.id },
            ]
        };

        const messages = await this.findManyWithoutPagination({ where });

        return messages;

    }

}
