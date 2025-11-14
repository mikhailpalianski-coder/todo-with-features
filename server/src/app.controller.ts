import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('server-info')
  getServerInfo() {
    return {
      serverId: process.env.SERVER_ID || 'unknown',
      hostname: process.env.HOSTNAME || 'unknown',
      timestamp: new Date().toISOString(),
      message: `This request was handled by ${process.env.SERVER_ID || 'unknown'} server`,
    };
  }
}
