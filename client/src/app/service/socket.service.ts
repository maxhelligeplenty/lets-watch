import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../interface/message.interface';
import { Event } from '../interface/event.interface';

import * as socketIo from 'socket.io-client';
import { VideoInfoInterface } from '../interface/video-info.interface';

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

    public onMessage():Observable<Message>
    {
        return new Observable<Message>(observer =>
        {
            this.socket.on('message', (data:Message) => observer.next(data));
        });
    }

    public state(state:number):void
    {
        this.socket.emit(Event.STATE, state);
    }

    public onState():Observable<number>
    {
        return new Observable<number>(observer =>
        {
            this.socket.on(Event.STATE, (data:number) => observer.next(data));
        });
    }

    public askVideoInformation():void
    {
        this.socket.emit(Event.ASK_VIDEO_INFORMATION);
    }

    public onAskVideoInfo():Observable<number>
    {
        return new Observable<number>(observer =>
        {
            this.socket.on(Event.SYNC_VIDEO_INFORMATION, () => observer.next());
        });
    }

    public syncTime(time:number):void
    {
        this.socket.emit(Event.SYNC_TIME, time);
    }

    public onSyncTime():Observable<number>
    {
        return new Observable<number>(observer =>
        {
            this.socket.on(Event.SYNC_TIME, (t:number) => observer.next(t));
        });
    }

    public syncVideoInformation(video:VideoInfoInterface):void
    {
        this.socket.emit(Event.SYNC_VIDEO_INFORMATION, video);
    }

    public onSyncVideoInformation():Observable<VideoInfoInterface>
    {
        return new Observable<VideoInfoInterface>(observer =>
        {
            this.socket.on(Event.SYNC_VIDEO_INFORMATION, (v:VideoInfoInterface) => observer.next(v));
        });
    }

    public newVideo(id:string):void
    {
        this.socket.emit(Event.NEW_VIDEO, id);
    }

    public onNewVideo():Observable<string>
    {
        return new Observable<string>(observer =>
        {
            this.socket.on(Event.NEW_VIDEO, (u:string) => observer.next(u));
        });
    }

    public onEvent(event:Event):Observable<Event>
    {
        return new Observable<Event>(observer =>
        {
            this.socket.on(event, () => observer.next());
        });
    }

    public play():void
    {
        this.socket.emit(Event.PLAY);
    }

    public onPlay():Observable<any>
    {
        return new Observable<any>(observer =>
        {
            this.socket.on(Event.PLAY, () => observer.next());
        });
    }

    public pause():void
    {
        this.socket.emit(Event.PAUSE);
    }

    public onPause():Observable<any>
    {
        return new Observable<any>(observer =>
        {
            this.socket.on(Event.PAUSE, () => observer.next());
        });
    }
}