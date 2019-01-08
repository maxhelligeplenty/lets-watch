import {
    createServer,
    Server
} from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Socket } from 'socket.io';
import { Message } from './model';
import { Event } from './model/event.interface';
import { VideoInfoInterface } from './model/video-info.interface';

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

        this.io.on(Event.CONNECT, (socket:Socket) =>
        {
            socket.on('message', (m:Message) =>
            {
                this.io.emit('message', m);
            });
            socket.on(Event.DISCONNECT, () =>
            {
                console.log('Client disconnected');
            });
            socket.on(Event.PLAY, () =>
            {
                this.io.emit(Event.PLAY);
            });
            socket.on(Event.PAUSE, () =>
            {
                this.io.emit(Event.PAUSE);
            });
            socket.on(Event.SYNC_TIME, (t:number) =>
            {
                console.log(t);
                this.io.emit(Event.SYNC_TIME, t);
            });
            socket.on(Event.NEW_VIDEO, (i:string) =>
            {
                console.log(i);
                this.io.emit(Event.NEW_VIDEO, i);
            });
            socket.on(Event.ASK_VIDEO_INFORMATION, () =>
            {
                socket.broadcast.emit(Event.ASK_VIDEO_INFORMATION);
            });
            socket.on(Event.SYNC_VIDEO_INFORMATION, (v:VideoInfoInterface) =>
            {
                console.log(v);
                this.io.emit(Event.SYNC_VIDEO_INFORMATION, v);
            });
        });
    }

    public getApp():express.Application
    {
        return this.app;
    }
}
