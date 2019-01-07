import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../interface/message.interface';
import { Event } from '../interface/event.interface';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService
{
    private socket;

    public initSocket():void
    {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message:Message):void
    {
        this.socket.emit('message', message);
    }

    public state(state:number):void
    {
        this.socket.emit('state', state);
    }

    public syncTime(time:number):void
    {
        this.socket.emit('sync-time', time);
    }

    public syncVideoInformation(video:any):void
    {
        this.socket.emit('sync-video-info', video);
    }

    public onState():Observable<number>
    {
        return new Observable<number>(observer =>
        {
            this.socket.on('state', (data:number) => observer.next(data));
        });
    }

    public onMessage():Observable<Message>
    {
        return new Observable<Message>(observer =>
        {
            this.socket.on('message', (data:Message) => observer.next(data));
        });
    }

    public onSyncTime():Observable<number>
    {
        return new Observable<number>(observer => {
            this.socket.on('sync-time', (t:number) => observer.next(t));
        });
    }

    public onSyncVideoInformation():Observable<any>
    {
        return new Observable<{}>(observer => {
            this.socket.on('sync-video-info', (v) => observer.next(v));
        });
    }

    public onEvent(event:Event):Observable<Event>
    {
        return new Observable<Event>(observer =>
        {
            this.socket.on(event, () => observer.next());
        });
    }

    public onVideoInfo(time:number):Observable<number>
    {
        return new Observable<number>(observer => {
            this.socket.on('sync-time', () => observer.next());
        });
    }
}