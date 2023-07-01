import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';


//type description fo bull job object
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis:{
    //expiration-depl.yaml:
    // env:
    //- name: REDIS_HOST
    //  value: expiration-redis-srv
    host: process.env.REDIS_HOST,
  }
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export { expirationQueue }


