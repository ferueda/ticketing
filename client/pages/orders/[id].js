import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Order = ({ order, user }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (res) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft <= 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <div>Time left: {timeLeft} seconds</div>
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_SkxgwqAVnxf82d99P6gRuSnX00MY7rKEV8"
        amount={order.ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  );
};

Order.getInitialProps = async (ctx, client) => {
  const { id } = ctx.query;
  const { data } = await client.get(`/api/orders/${id}`);
  return { order: data };
};

export default Order;
