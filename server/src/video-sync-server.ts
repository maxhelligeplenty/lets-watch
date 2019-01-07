import {
    createServer,
    Server
} from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';

import { Message } from './model';

export class VideoSyncServer
{
    public static readonly PORT:number = 8080;
    private app:express.Application;
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
        this.app = express();
    }

    private createServer():void
    {
        this.server = createServer(this.app);
    }

    private config():void
    {
        this.port = process.env.PORT || VideoSyncServer.PORT;
    }

    private sockets():void
    {
        this.io = socketIo(this.server);
    }

    private listen():void
    {
        this.server.listen(this.port, () =>
        {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket:Socket) =>
        {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m:Message) =>
            {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () =>
            {
                console.log('Client disconnected');
            });

            socket.on('state', (s:number) =>
            {
                this.io.emit('state', s);
            });

            socket.on('sync-time', (t:number) =>
            {
                this.io.emit('sync-time', t);
            });

            socket.on('new-video', (id:number) =>
            {
                this.io.emit('new-video', id);
            });

            socket.on('video-info', () =>
            {
                socket.broadcast.emit('video-info');
            });

            socket.on('sync-video-info', (v:any) =>
            {
                this.io.emit('sync-video-info', v);
            });
        });
    }

    public getApp():express.Application
    {
        return this.app;
    }
}
