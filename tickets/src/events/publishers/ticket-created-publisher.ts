import { Publisher, Subject, TicketCreatedEvent } from '@frticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
}
