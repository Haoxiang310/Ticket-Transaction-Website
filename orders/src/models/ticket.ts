import mongoose from 'mongoose';
//export OrderStatus in order.ts and import in other files
//is to make sure that one source fo all order related things
//other files may also need to import the OrderStatus enum file
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//Order service doesn't care about other attrs of ticket,
//we only cares about title and price
//so we do not reuse or share the model definition of ticket service
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise <TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);


ticketSchema.set('versionKey','version');

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event : {id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};

ticketSchema.methods.isReserved = async function(){
  // this === the ticket document that we just called 'isReserved' on
  // in case we mess up the this keyword while using arrow function

  //  Run query to look at all orders. Find an order where the ticket 
  //  is the ticket we just found *and* the orders status is *not* cancelled.
  //  If we find an order from that means the ticekt *is* reserved
  const existingOrder = await Order.findOne({
    ticket: this,
    status:{
      $in:[
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ],
    },
  });

  return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
