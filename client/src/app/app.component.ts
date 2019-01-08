import {
    Component,
    OnInit
} from '@angular/core';
import { SyncVideoInterface } from './interface/sync-video.interface';
import { isNullOrUndefined } from 'util';
import { Message } from './interface/message.interface';
import { Action } from './interface/action.interface';

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

    private socket;

    constructor()
    {

    }

    public ngOnInit():void
    {
        setTimeout(() =>
        {
            this.initIoConnection();
        }, 0);
    }

    public addNewVideoUrl(newUrl:string):void
    {
        this.syncData.player.loadVideoById(this.getVideoId(newUrl));
    }

    //public sendMessage():void
    //{
    //    this.socketService.send({
    //        content: this.newVideoUrl
    //    });
    //    this.newVideoUrl = null;
    //}

    protected savePlayer(player:YT.Player):void
    {
        this.syncData = {
            videoId: this.videoId,
            player:  player
        };
        this.syncData.player.loadVideoById(this.videoId);
    }

    protected onStateChange():void
    {
        this.socket.emit(Action.STATE, this.syncData.player.getPlayerState());
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

    private syncVideoTime(currentTime):void
    {
        if(this.syncData.player.getCurrentTime() < currentTime - 0.2 || this.syncData.player.getCurrentTime() > currentTime + 0.2)
        {
            this.syncData.player.seekTo(currentTime, false);
            this.syncData.player.playVideo();
        }
    }

    private initIoConnection():void
    {
        this.socket = socketIo(SERVER_URL);
        this.socket.on(Action.CONNECT, () =>
        {
            this.socket.emit(Action.ASK_VIDEO_INFORMATION);
        });
        this.socket.on(Action.DISCONNECT, () =>
        {
            console.log('Disconnected');
        });
        this.socket.on(Action.ASK_TIME, () =>
        {
            this.socket.emit(Action.SYNC_TIME, this.syncData.player.getCurrentTime());
        });
        this.socket.on(Action.STATE, (state:number) =>
        {
            switch(state)
            {
                case -1:
                    this.syncData.player.playVideo();
                    break;
                case 1:
                    this.socket.emit(Action.SYNC_TIME, this.syncData.player.getCurrentTime());
                    this.syncData.player.playVideo();
                    break;
                case 2:
                    this.syncData.player.pauseVideo();
                    break;
                case 3:
                    this.socket.emit(Action.SYNC_TIME, this.syncData.player.getCurrentTime());
                    break;
                default:
                    console.log('Omea wa moe Shineriu');
                    break;
            }
        });
        this.socket.on(Action.SYNC_TIME, (currentTime:number) =>
        {
            this.syncVideoTime(currentTime);
        });
        this.socket.on(Action.NEW_VIDEO, (videoUrl:string) =>
        {
            this.syncData.player.loadVideoById({
                videoId: this.getVideoId(videoUrl)
            });
        });
        this.socket.on(Action.ASK_VIDEO_INFORMATION, () =>
        {
            let info = {
                url:         this.syncData.player.getVideoUrl(),
                currentTime: this.syncData.player.getCurrentTime()
            };
            this.socket.emit(Action.SYNC_VIDEO_INFORMATION, info);
        });
        this.socket.on(Action.SYNC_VIDEO_INFORMATION, (data) =>
        {
            let videoId = this.getVideoId(data.url);
            this.syncData.player.loadVideoById({
                videoId:      videoId,
                startSeconds: data.currentTime
            })
        });
    }
}
