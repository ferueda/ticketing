import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

// Describes properties required
// to create a new ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// Describes the properties a Ticket document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  version: number;
  price: number;
  isAvailable(): Promise<boolean>;
}

// Describes properties the Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.methods.isAvailable = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
