import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <div>
      <Header user={user} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser').catch((err) => {
    console.log(err);
  });
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps, user: data.user };
};

export default AppComponent;
