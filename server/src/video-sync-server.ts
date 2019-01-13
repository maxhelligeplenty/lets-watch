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
            let room:string = '';
            let username:string = '';
            socket.on(Event.JOIN, (r:string, c:string) =>
            {
                socket.join(r);
                room = r;
                username = c;
                this.io.to(room).emit(Event.SEND_MESSAGE, {
                    content: username + ' connected'
                });
            });
            socket.on(Event.SEND_MESSAGE, (m:Message) =>
            {
                this.io.to(room).emit(Event.SEND_MESSAGE, m);
            });
            socket.on(Event.DISCONNECT, () =>
            {
                this.io.to(room).emit(Event.SEND_MESSAGE, {
                    content: username + ' disconnected'
                });
            });
            socket.on(Event.PLAY, () =>
            {
                socket.to(room).emit(Event.PLAY);
            });
            socket.on(Event.PAUSE, () =>
            {
                socket.to(room).emit(Event.PAUSE);
            });
            socket.on(Event.SYNC_TIME, (t:number) =>
            {
                socket.to(room).emit(Event.SYNC_TIME, t);
            });
            socket.on(Event.NEW_VIDEO, (i:string) =>
            {
                this.io.to(room).emit(Event.NEW_VIDEO, i);
            });
            // TODO emit to HOST user so just one client send info
            socket.on(Event.ASK_VIDEO_INFORMATION, (socketId:string) =>
            {
                this.io.to(room).emit(Event.ASK_VIDEO_INFORMATION, socketId);
            });
            socket.on(Event.SYNC_VIDEO_INFORMATION, (v:VideoInfoInterface, socketId:string) =>
            {
                socket.broadcast.to(socketId).emit(Event.SYNC_VIDEO_INFORMATION, v);
            });
        });
    }

    public getApp():express.Application
    {
        return this.app;
    }
}
