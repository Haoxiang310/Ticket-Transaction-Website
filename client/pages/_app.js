import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
//next will load each js files into _app.js file to return the component
//so when importing global css, we need to add it into this file
const AppComponent = ( { Component, pageProps, currentUser }) => {
  return(
    <div>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps} />
    </div>   
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {} ;
  if(appContext.Component.getInitialProps){
    pageProps = await appContext.Component.getInitialProps(appContext.ctx); 
  }
  console.log({data});
  return {
    pageProps,
    ...data
  }
};

export default AppComponent;