import { Publisher, Subject, TicketUpdatedEvent } from '@frticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
}
