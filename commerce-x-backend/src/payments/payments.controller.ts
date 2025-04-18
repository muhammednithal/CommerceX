import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { Stripe } from 'stripe';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent/:orderId')
  async createPaymentIntent(@Param('orderId') orderId: number) {
    return this.paymentsService.createPaymentIntent(+orderId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.paymentsService
        .getStripe()
        .webhooks.constructEvent(
          (req as any).rawBody,
          sig,
          'YOUR_STRIPE_WEBHOOK_SECRET',
        );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${(err as Error).message}`);
    }

    await this.paymentsService.handleWebhook(event);
  }
}
