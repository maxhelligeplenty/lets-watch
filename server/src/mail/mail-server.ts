import {
  createServer,
  Server
} from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Event } from '../model/event.interface';

export class MailServer
{
  public readonly PORT:number = 1337;
  private mailServer:express.Application;
  private server:Server;
  private io:socketIo.Server;
  private port:string | number;

  constructor()
  {
      this.createApp();
      this.config();
      this.createServer();
      this.sockets();
      this.listen();
  }

  private createApp():void
  {
      this.mailServer = express();
  }

  private createServer():void
  {
      this.server = createServer(this.mailServer);
  }

  private config():void
  {
      this.port = process.env.PORT || this.PORT;
  }

  private sockets():void
  {
      this.io = socketIo(this.server);
  }
  
  private listen():void
  {
      this.server.listen(this.port, () =>
      {
          console.log('Running mail server on port %s', this.port);
      });

      this.io.on(Event.CONNECT, (socket:Socket) =>
      {
          socket.on(Event.SEND_MAIL, () =>
          {
              console.log('mail send');
          });
      });
  }

  public getApp():express.Application
  {
      return this.mailServer;
  }
}
