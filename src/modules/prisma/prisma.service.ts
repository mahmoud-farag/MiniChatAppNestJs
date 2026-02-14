import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'error', 'warn'], // remove 'query' in production
      // datasources - Prisma auto-detects DATABASE_URL from the .env file
      // datasources: {
      //   db: {
      //     url: process.env.DATABASE_URL,
      //   },
      // },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
