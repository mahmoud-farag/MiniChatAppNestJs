import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MessageService {
    
    constructor(private readonly prisma: PrismaService) {}
    
}
