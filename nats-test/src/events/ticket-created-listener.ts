import { Listener } from './base-listener';
import { Message, Stan } from 'node-nats-streaming';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //this statement make sure that we can never change the subject type to other that is not Subjects.TicketCreated
  //type and value are both restricted
  subject: Subjects.TicketCreated = Subjects.TicketCreated;


  queueGroupName = 'payments-service';

  //onMessage function is the logic that we need to run after receiving a event
  onMessage(data: TicketCreatedEvent['data'], msg: Message){  
    console.log('Event data!',data);

    msg.ack();
  }
}