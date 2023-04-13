import { ExpirationCompleteEvent, Publisher, Subject } from '@frticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
}
