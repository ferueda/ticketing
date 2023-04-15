import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const Ticket = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => Router.push('/orders/[id]', `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

Ticket.getInitialProps = async (ctx, client) => {
  const { id } = ctx.query;
  const { data } = await client.get(`/api/tickets/${id}`);
  return { ticket: data };
};

export default Ticket;
