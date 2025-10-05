import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Payment Service!';
  }

  getHealth(): object {
    return {
      status: 'OK',
      service: 'payment-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
