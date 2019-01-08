import {
    createServer,
    Server
} from 'http';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Message } from './model';
import * as express from 'express';
import { Action } from './model/action.interface';

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

        this.io.on(Action.DISCONNECT, (socket:Socket) =>
        {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m:Message) =>
            {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on(Action.DISCONNECT, () =>
            {
                console.log('Client disconnected');
            });

            socket.on(Action.STATE, (s:number) =>
            {
                socket.broadcast.emit(Action.STATE, s);
            });

            socket.on(Action.SYNC_TIME, (t:number) =>
            {
                socket.broadcast.emit(Action.SYNC_TIME, t);
            });

            socket.on(Action.NEW_VIDEO, (id:number) =>
            {
                this.io.emit(Action.NEW_VIDEO, id);
            });

            socket.on(Action.ASK_VIDEO_INFORMATION, () =>
            {
                socket.broadcast.emit(Action.ASK_VIDEO_INFORMATION);
            });

            socket.on(Action.ASK_TIME, () =>
            {
                socket.broadcast.emit(Action.ASK_TIME);
            });

            socket.on(Action.SYNC_VIDEO_INFORMATION, (v:any) =>
            {
                this.io.emit(Action.SYNC_VIDEO_INFORMATION, v);
            });
        });
    }

    public getApp():express.Application
    {
        return this.app;
    }
}
