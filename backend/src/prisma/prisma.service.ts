import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const attempts = 5;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const waking = message.includes("Can't reach database server");
        if (!waking || attempt === attempts) throw error;
        const wait = attempt * 3000;
        console.warn(
          `Database is waking up (${attempt}/${attempts}). Retrying in ${wait / 1000}s.`,
        );
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
