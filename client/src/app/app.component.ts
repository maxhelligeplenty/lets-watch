import {
    Component,
    OnInit
} from '@angular/core';
import { SyncVideoInterface } from './interface/sync-video.interface';
import { isNullOrUndefined } from 'util';
import { SocketService } from './service/socket.service';
import { Event } from './interface/event.interface';
import { Message } from './interface/message.interface';

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

    constructor(private socketService:SocketService)
    {

    }

    public ngOnInit():void
    {
        setTimeout(() =>
        {
            this.initIoConnection();
            this.socketService.syncVideoInformation({
                url:         this.syncData.player.getVideoUrl(),
                currentTime: this.syncData.player.getCurrentTime()
            });
        }, 0);
        this.syncData.player.playVideo();
    }

    public addNewVideoUrl(newUrl:string):void
    {
        this.syncData.player.cueVideoById(this.getVideoId(newUrl));
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

    public sendMessage():void
    {
        this.socketService.send({
            content: this.newVideoUrl
        });
        this.newVideoUrl = null;
    }

    protected savePlayer(player:YT.Player):void
    {
        this.syncData = {
            videoId: this.videoId,
            player:  player
        };
        this.syncData.player.loadVideoById(this.videoId);
        console.log('player instance', player);
    }

    protected onStateChange():void
    {
        this.socketService.state(this.syncData.player.getPlayerState());
    }

    private initIoConnection():void
    {
        this.socketService.initSocket();

        this.socketService.onMessage().subscribe((message:Message) =>
        {
            this.messages.push(message);
        });

        this.socketService.onSyncTime().subscribe((time:number) =>
        {
            this.syncVideoTime(time);
        });

        this.socketService.onSyncVideoInformation().subscribe((videoInfo:any) =>
        {
            this.syncData.player.loadVideoById({
                videoId:      this.getVideoId(videoInfo.url),
                startSeconds: videoInfo.currentTime
            })
        });

        this.socketService.onState().subscribe((state:number) =>
        {
            switch(state)
            {
                case -1:
                    this.syncData.player.playVideo();
                    break;
                case 1:
                    this.socketService.syncTime(this.syncData.player.getCurrentTime());
                    this.syncData.player.playVideo();
                    break;
                case 2:
                    this.syncData.player.pauseVideo();
                    break;
                case 3:
                    this.socketService.syncTime(this.syncData.player.getCurrentTime());
                default:
                    break;
            }
        });

        this.socketService.onEvent(Event.CONNECT).subscribe(() =>
        {
            console.log('connected');
        });

        this.socketService.onEvent(Event.DISCONNECT).subscribe(() =>
        {
            console.log('disconnected');
        });
    }

    private syncVideoTime(currentTime):void
    {
        //only sync if time is not synced yet
        if(this.syncData.player.getCurrentTime() < currentTime - 0.2 || this.syncData.player.getCurrentTime() > currentTime + 0.2)
        {
            this.syncData.player.seekTo(currentTime, false);
            this.syncData.player.playVideo();
        }
    }
}

