import { Listener, OrderStatus, PaymentCreatedEvent, Subject } from '@frticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) throw new Error('Order not found');
    order.set({ status: OrderStatus.Complete });
    await order.save();
    msg.ack();
  }
}
