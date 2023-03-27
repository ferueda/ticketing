import { Publisher, OrderCreatedEvent, Subject } from '@frticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
