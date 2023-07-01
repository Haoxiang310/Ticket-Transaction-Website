import { Subjects, Publisher, ExpirationCompleteEvent } from "@hxtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}