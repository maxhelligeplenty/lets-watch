import {
    Component,
    OnInit
} from '@angular/core';
import { SyncVideoInterface } from './interface/sync-video.interface';
import { isNullOrUndefined } from 'util';
import { Event } from './interface/event.interface';
import { Message } from './interface/message.interface';
import { VideoInfoInterface } from './interface/video-info.interface';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Component({
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    public newVideoUrl:string;
    public syncData:SyncVideoInterface;
    public videoHistoryList:string[] = [];
    public messages:Message[] = [];

    protected videoId:string = 'WEkSYw3o5is';

    private isReady:boolean = false;
    private socket;

    constructor()
    {

    }

    public ngOnInit():void
    {
    }

    public addNewVideoUrl(url:string):void
    {
        if(!isNullOrUndefined(url))
        {
            this.syncData.socket.emit(Event.NEW_VIDEO, url);
        }
    }

    private getVideoId(url):string
    {
        if(!isNullOrUndefined(url) && !isNullOrUndefined(this.syncData.player))
        {
            let idRegex:RegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
            let videoId:string = url.split(idRegex)[1];
            this.videoHistoryList.push(videoId);
            return videoId;
        }
    }

    protected savePlayer(player:YT.Player):void
    {
        this.initIoConnection();
        this.syncData = {
            videoId: this.videoId,
            player:  player,
            socket:  this.socket
        };
        this.syncData.player.loadVideoById(this.videoId);
        this.isReady = true;
    }

    protected onStateChange():void
    {
        switch(this.syncData.player.getPlayerState())
        {
            case -1:
                this.syncData.socket.emit(Event.PLAY);
                break;
            case 0:
                break;
            case 1:
                this.syncData.socket.emit(Event.SYNC_TIME, this.syncData.player.getCurrentTime());
                this.syncData.socket.emit(Event.PLAY);
                break;
            case 2:
                this.syncData.socket.emit(Event.PAUSE);
                break;
            case 3:
                this.syncData.socket.emit(Event.SYNC_TIME, this.syncData.player.getCurrentTime());
                break;
            case 5:
                break;
            default:
                break;
        }
    }

    private initIoConnection():void
    {
        this.socket = socketIo(SERVER_URL);

        this.socket.on(Event.CONNECT, () =>
        {
            this.socket.emit(Event.ASK_VIDEO_INFORMATION);
        });

        this.socket.on(Event.DISCONNECT, () =>
        {
            console.log('Cya');
        });

        this.socket.on(Event.PLAY, () =>
        {
            this.syncData.player.playVideo();
        });

        this.socket.on(Event.PAUSE, () =>
        {
            this.syncData.player.pauseVideo();
        });

        this.socket.on(Event.SYNC_TIME, (time:number) =>
        {
            this.syncVideoTime(time);
        });

        this.socket.on(Event.NEW_VIDEO, (url:string) =>
        {
            this.syncData.player.loadVideoById({
                videoId: this.getVideoId(url)
            });
        });

        this.socket.on(Event.ASK_VIDEO_INFORMATION, () =>
        {
            let videoInfo:VideoInfoInterface = {
                url:  this.syncData.player.getVideoUrl(),
                time: this.syncData.player.getCurrentTime()
            };
            this.socket.emit(Event.SYNC_VIDEO_INFORMATION, videoInfo);
        });

        this.socket.on(Event.SYNC_VIDEO_INFORMATION, (videoInfo:VideoInfoInterface) =>
        {
            this.syncData.player.loadVideoById({
                videoId:      this.getVideoId(videoInfo.url),
                startSeconds: videoInfo.time
            });
        });
    }

    private syncVideoTime(time:number):void
    {
        if(this.syncData.player.getCurrentTime() < time - 0.2 || this.syncData.player.getCurrentTime() > time + 0.2)
        {
            this.syncData.player.seekTo(time, false);
        }
    }
}

