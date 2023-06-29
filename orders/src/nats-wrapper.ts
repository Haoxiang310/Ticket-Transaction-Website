import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if(!this._client){
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId,clientId, { url } );

    return new Promise<void>((resolve, reject)=> {
      this.client.on('connect',() => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error',(err) => {
        reject(err);
      });
    })
    
  }
}

//export an instance rather than a class
//make sure every other file that get use to this nats client uses the same client instance
//same as mongoose, which can be connected once inside the index.ts file and then used inside of other files such as new.ts
export const natsWrapper = new NatsWrapper();