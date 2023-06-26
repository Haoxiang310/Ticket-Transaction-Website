import nats, { Message } from 'node-nats-streaming';
import { randomBytes} from 'crypto' ;

console.clear();
const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
  url:'http://localhost:4222'
});

stan.on('connect',()=>{
  console.log('Listener connected to NATS');

  stan.on('close',()=>{
    console.log('NATS connection closed!');
    process.exit();
  })
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    //with setDeliverAllAvailable, when we first get our service online, our service will receive all the history events, and build up the durable subscription between service and nats server
    .setDeliverAllAvailable()
    //with setDurableName, we can store all the status of past events. If some of them are not delivered due to the offline of server, it will record it and when the server is online again, it only send these undelivered events to the server, rather than send all the history events
    .setDurableName('accounting-service');
  const subscription = stan.subscribe(
    'ticket:created',
    //with queue-group, when client is offline, we do not dump the durablename
    //also, events only go into one of the services, even we have several instances of a single service
    'queue-group-name',
    options);

  subscription.on('message',(msg: Message)=>{
    const data = msg.getData();
    if(typeof data === 'string'){
      console.log(`Received event #${msg.getSequence()},with data: ${data}`);
    }

    msg.ack();
  })
});

process.on('SIGINT',() => stan.close());
process.on('SIGTERM',() => stan.close());