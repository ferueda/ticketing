import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus, Subject } from '@frticketing/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { expirationQueue } from '../../../queues/expiration-queue';
import { queueGroupName } from '../queue-group-name';
import Queue from 'bull';

// Mock expirationQueue and natsWrapper
jest.mock('../../../queues/expiration-queue');
jest.mock('../../../nats-wrapper');
jest.mock('bull');

const setup = () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: 'order-id',
    version: 0,
    status: OrderStatus.Created,
    userId: 'user-id',
    expiresAt: '2023-04-20T12:00:00.000Z',
    ticket: {
      id: 'ticket-id',
      price: 100,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Order Created Listener', () => {
  it('schedules a job with the correct delay', async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(expirationQueue.add).toHaveBeenCalled();
  });

  it('acks the message', async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
