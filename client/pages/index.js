import buildClient from '../api/buildClient';

const LandingPage = ({ user }) => {
  return user ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

LandingPage.getInitialProps = async (ctx) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err);
  });

  return { user: data.user };
};

export default LandingPage;
