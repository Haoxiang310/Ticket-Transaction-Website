import { Publisher, Subjects, TicketUpdatedEvent} from '@hxtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}