import { Controller, Get, Query, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import type { IRequestWithUser } from 'src/common/inderfaces';

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService,
    ) {}


    @Get('all')
    async getMessages(@Request() req: IRequestWithUser, @Query() query: {id: string}) {

        const {id: receiverId } = query;

        const loggedUser = req.user;
        const messages = await this.messageService.getMessages({ loggedUser, receiverId});

        return messages;

    }
    
}
