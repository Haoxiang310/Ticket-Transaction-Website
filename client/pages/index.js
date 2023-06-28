import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
};

//request from a component always 
//issued from the browser, so use a domain of ""

//request from getInitialProps, might be executed
//from server or browser(browser is very particular circumstance)
//function, not component
//execute on server, not client
//fetch data during serverside rendering
//render one time
//cross namespace communication, from client to ingress nginx
LandingPage.getInitialProps = async (context) => {
  console.log('LANDING PAGE');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
  // //window only exist on browser
  // if(typeof window === 'undefined') {
  //     //we're on server
  //     //request should be made to http://ingress-nginx.ingress-nginx...
  //     const { data }= await axios.get(
  //       'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
  //       {
  //         headers:req.headers
  //       }
  //       );
  //       //return data to prop(currentUser) of LandingPage component
  //     return data;
  //   }
  // else {
  //   //we're on the browser
  //   //request can be made with a base url of ''
  //   const { data } = await axios.get('/api/users/currentuser');
  //   return data;
  //   }
}
export default LandingPage;