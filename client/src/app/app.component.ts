import {
    Component,
    OnInit
} from '@angular/core';
import { SyncVideoInterface } from './interface/sync-video.interface';
import { isNullOrUndefined } from 'util';
import { SocketService } from './service/socket.service';
import { Event } from './interface/event.interface';
import { Message } from './interface/message.interface';
import { VideoInfoInterface } from './interface/video-info.interface';

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

    constructor(private socketService:SocketService)
    {

    }

    public ngOnInit():void
    {
        this.initIoConnection();
    }

    public addNewVideoUrl(newUrl:string):void
    {
        this.socketService.newVideo(this.getVideoId(newUrl));
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
        this.isReady = true;
    }

    protected onStateChange():void
    {
        this.socketService.state(this.syncData.player.getPlayerState());
    }

    private initIoConnection():void
    {
        this.socketService.initSocket();
        this.socketService.onEvent(Event.CONNECT).subscribe(() =>
        {
            this.socketService.askVideoInformation();
        });
        this.socketService.onEvent(Event.DISCONNECT).subscribe(() =>
        {
        });
        this.socketService.onAskVideoInfo().subscribe(() =>
        {
            let videoInfo:VideoInfoInterface = {
                url:  this.syncData.player.getVideoUrl(),
                time: this.syncData.player.getCurrentTime()
            };
            this.socketService.syncVideoInformation(videoInfo);
        });
        this.socketService.onMessage().subscribe((message:Message) =>
        {
            this.messages.push(message);
        });
        this.socketService.onSyncTime().subscribe((time:number) =>
        {
            this.syncVideoTime(time);
        });
        this.socketService.onNewVideo().subscribe((id:string) =>
        {
            this.syncData.player.loadVideoById({
                videoId: id
            })
        });
        this.socketService.onSyncVideoInformation().subscribe((videoInfo:VideoInfoInterface) =>
        {
            this.syncData.player.loadVideoById({
                videoId:      this.getVideoId(videoInfo.url),
                startSeconds: videoInfo.time
            })
        });
        this.socketService.onPlay().subscribe(() =>
        {
            this.syncData.player.playVideo();
        });
        this.socketService.onPause().subscribe(() =>
        {
            this.syncData.player.pauseVideo();
        });
        this.socketService.onState().subscribe((state:number) =>
        {
            if(!isNullOrUndefined(this.isReady))
            {
                switch(state)
                {
                    case -1:
                        this.socketService.play();
                        break;
                    case 1:
                        this.socketService.play();
                        this.socketService.syncTime(this.syncData.player.getCurrentTime());
                        console.log(this.syncData.player.getPlayerState());
                        break;
                    case 2:
                        this.socketService.pause();
                        console.log(this.syncData.player.getPlayerState());
                        break;
                    case 3:
                        this.socketService.syncTime(this.syncData.player.getCurrentTime());
                        console.log(this.syncData.player.getPlayerState());
                    default:
                        break;
                }
            }
        });
    }

    private syncVideoTime(currentTime):void
    {
        this.syncData.player.seekTo(currentTime, false);
    }
}

