import { Controller, Post, Body, Get, Param, Injectable } from '@nestjs/common';
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

function sanitizeHtml(input: string): string {
  if (!input) return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/<script[^>]*>.*?<\/script>/gi, '');
}

@Injectable()
class MockDatabaseService {
  private payments = [];
  private nextId = 1;

  async query(sql: string, params: any[]) {
    if (sql.includes('INSERT INTO payments')) {
      const payment = {
        id: this.nextId++,
        amount: params[0],
        card_number: params[1],
        description: params[2],
        created_at: new Date().toISOString()
      };
      this.payments.push(payment);
      return { insertId: payment.id };
    }

    if (sql.includes('SELECT * FROM payments WHERE id')) {
      return this.payments.find(p => p.id == params[0]) || null;
    }

    return null;
  }
}

class PaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  cardNumber: string;

  @IsString()
  @Transform(({ value }) => sanitizeHtml(value))
  description: string;
}

@Controller('payments')
export class PaymentController {
  private db = new MockDatabaseService();

  @Post()
  async createPayment(@Body() paymentDto: PaymentDto) {

    const query = 'INSERT INTO payments (amount, card_number, description) VALUES ($1, $2, $3)';
    const result = await this.db.query(query, [
      paymentDto.amount,
      paymentDto.cardNumber,
      paymentDto.description
    ]);

    return {
      id: result.insertId,
      message: sanitizeHtml('Payment processed successfully'),
      sanitizedData: {
        amount: paymentDto.amount,
        cardNumber: paymentDto.cardNumber,
        description: paymentDto.description
      }
    };
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {

    const query = 'SELECT * FROM payments WHERE id = $1';
    const payment = await this.db.query(query, [id]);

    if (!payment) {
      return { error: 'Payment not found' };
    }

    return {
      id: payment.id,
      amount: payment.amount,
      cardNumber: sanitizeHtml(payment.card_number),
      description: sanitizeHtml(payment.description),
      createdAt: payment.created_at
    };
  }
}
