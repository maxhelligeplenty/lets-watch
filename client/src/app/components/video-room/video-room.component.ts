import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { SyncVideoInterface } from '../../interface/sync-video.interface';
import { Message } from '../../interface/message.interface';
import { Event } from '../../interface/event.interface';
import { isNullOrUndefined } from 'util';
import { VideoInfoInterface } from '../../interface/video-info.interface';
import * as socketIo from 'socket.io-client';
import * as copy from 'copy-to-clipboard';
import { UserInterface } from '../../interface/user.interface';

const SERVER_URL = 'http://localhost:8080';

@Component({
    selector:    'video-room',
    templateUrl: './video-room.component.html',
    styleUrls:   ['./video-room.component.scss']
})
export class VideoRoomComponent implements OnInit
{
    public newVideoUrl:string;
    public syncData:SyncVideoInterface;
    public videoHistoryList:Array<string> = [];
    public messages:Array<Message> = [];
    public newMessage:string;

    @Input() protected room:string = 'whatHappened';
    protected videoId:string = 'xfr-OiX-46w';

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

    public copyInviteLinkToClipboard():void
    {
        // TODO Replace with active Route
        copy(document.location.href);
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
            videoId:  this.videoId,
            player:   player,
            socket:   this.socket,
            room:     this.room,
        };

        this.syncData.player.loadVideoById(this.videoId);
        this.isReady = true;
    }

    protected onStateChange():void
    {
        if(this.isReady)
        {
            switch(this.syncData.player.getPlayerState())
            {
                case -1:
                    this.syncData.socket.emit(Event.PLAY);
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
                    this.syncData.socket.emit(Event.PLAY);
                    break;
                default:
                    break;
            }
        }
    }

    protected sendMessage(text:string):void
    {
        let user:UserInterface = {
            name: this.syncData.clientId
        };
        let message:Message = {
            from:    user,
            content: text
        };
        if(text.length !== 0)
        {
            this.syncData.socket.emit(Event.SEND_MESSAGE, message);
            this.newMessage = "";
        }
    }

    private initIoConnection():void
    {
        this.socket = socketIo(SERVER_URL);

        this.socket.on(Event.CONNECT, () =>
        {
            this.syncData.clientId = this.socket.id;
            this.socket.emit(Event.JOIN, this.syncData.room);
            this.socket.emit(Event.ASK_VIDEO_INFORMATION);
            this.sendMessage('connected');
        });

        this.socket.on(Event.DISCONNECT, () =>
        {
            console.log('Cya');
        });

        this.socket.on(Event.SEND_MESSAGE, (message:Message) =>
        {
            this.messages.push(message);
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
        if(this.syncData.player.getCurrentTime() < time - 0.1 || this.syncData.player.getCurrentTime() > time + 0.1)
        {
            this.syncData.player.seekTo(time, true);
        }
    }
}
