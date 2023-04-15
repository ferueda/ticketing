import { PaymentCreatedEvent, Publisher, Subject } from '@frticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
