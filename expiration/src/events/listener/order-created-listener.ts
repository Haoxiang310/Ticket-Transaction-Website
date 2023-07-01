import { Listener, OrderCreatedEvent, Subjects } from "@hxtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message){

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many ms to process the job',delay);
    //The delay is given in milliseconds and it defines how long to wait before this job can be processed. 
    //The job will be added to the queue immediately but will not be processable until the specified delay has passed.
    await expirationQueue.add({
      orderId: data.id
    },{
      delay
    }
    );

    msg.ack();
  }
}