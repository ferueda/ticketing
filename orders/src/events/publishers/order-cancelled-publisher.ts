import { Publisher, OrderCancelledEvent, Subject } from '@frticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}
