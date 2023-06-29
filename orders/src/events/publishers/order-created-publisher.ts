import { Publisher, OrderCreatedEvent, Subjects } from "@hxtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}