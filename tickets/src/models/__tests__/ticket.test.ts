import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 20 });

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should have thrown');
});

it('increments the version number on multiple events', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
