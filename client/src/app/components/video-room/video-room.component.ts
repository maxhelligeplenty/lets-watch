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
import { UserInterface } from '../../interface/user.interface';

import * as socketIo from 'socket.io-client';
import * as copy from 'copy-to-clipboard';
import * as rug from 'random-username-generator';
import { PlaylistInterface } from '../../interface/playlist.interface';
import { YoutubeVideoDataService } from '../../service/youtube-video-data.service';

const SERVER_URL = 'http://localhost:8080';

@Component({
    selector:    'video-room',
    templateUrl: './video-room.component.html',
    styleUrls:   ['./video-room.component.scss']
})
export class VideoRoomComponent implements OnInit
{
    @Input() protected room:string = 'whatHappened';

    public newVideoUrl:string;
    public syncData:SyncVideoInterface;
    public videoHistoryList:Array<PlaylistInterface> = [];
    public messages:Array<Message> = [];
    public newMessage:string;

    protected videoId:string = 'xfr-OiX-46w';

    private isReady:boolean = false;
    private user:UserInterface;
    private socket;

    constructor(private youtubeVideoDataService:YoutubeVideoDataService)
    {

    }

    public ngOnInit():void
    {

    }

    public addNewVideoUrl(url:string):void
    {
        if(!isNullOrUndefined(url))
        {
            let videoId:string = this.getVideoId(url);
            this.youtubeVideoDataService.getVideoInfoById(videoId).subscribe((res:any) =>
            {
                let videoData:PlaylistInterface = {
                    videoId:   videoId,
                    videoData: {
                        thumbnail: res.items[0].snippet.thumbnails.default.url,
                        title:     res.items[0].snippet.localized.title
                    }
                };
                this.syncData.socket.emit(Event.NEW_VIDEO, videoData);
            });
            this.newVideoUrl = undefined;
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
            return videoId;
        }
    }

    protected savePlayer(player:YT.Player):void
    {
        this.initIoConnection();
        this.syncData = {
            videoId: this.videoId,
            player:  player,
            socket:  this.socket,
            room:    this.room,
        };
        this.syncData.player.playVideo();
        this.isReady = true;
    }

    protected onStateChange():void
    {
        if(this.isReady)
        {
            switch(this.syncData.player.getPlayerState())
            {
                case -1:
                    break;
                case 1:
                    this.syncData.socket.emit(Event.SYNC_TIME, this.syncData.player.getCurrentTime());
                    this.syncData.socket.emit(Event.PLAY);
                    break;
                case 2:
                    this.syncData.socket.emit(Event.PAUSE);
                    break;
                case 3:
                    this.syncData.player.playVideo();
                    break;
                default:
                    break;
            }
        }
    }

    protected sendMessage(text:string):void
    {
        if(!isNullOrUndefined(text))
        {
            let message:Message = {
                from:    this.user,
                content: text
            };
            this.syncData.socket.emit(Event.SEND_MESSAGE, message);
            this.newMessage = undefined;
        }
    }

    protected playNewVideoById(id:string)
    {
        this.syncData.socket.emit(Event.PLAY_NEW_VIDEO, id);
    }

    private initIoConnection():void
    {
        this.socket = socketIo(SERVER_URL);

        this.socket.on(Event.CONNECT, () =>
        {
            this.syncData.clientId = this.socket.id;
            this.user = {
                id:   this.syncData.clientId,
                name: rug.generate()
            };

            // TODO emit whole user to give first client HOST status. So new client gets data from HOST and not from all clients when ask
            this.syncData.socket.emit(Event.JOIN, this.syncData.room, this.user.name);
            this.syncData.socket.emit(Event.ASK_VIDEO_INFORMATION, this.socket.id);
        });

        this.socket.on(Event.SEND_MESSAGE, (message:Message) =>
        {
            this.messages.push(message);
        });

        this.socket.on(Event.PLAY_NEW_VIDEO, (id:string) =>
        {
            this.syncData.player.loadVideoById({
                videoId: id,
            });
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

        this.socket.on(Event.NEW_VIDEO, (videoData:PlaylistInterface) =>
        {
            this.videoHistoryList.push(videoData);
        });

        this.socket.on(Event.ASK_VIDEO_INFORMATION, (socketId:string) =>
        {
            // TODO TEST if send player and sync with ViewChild on Player makes same / better function as / than current
            // TODO so we can build on VC
            let videoInfo:VideoInfoInterface = {
                url:  this.syncData.player.getVideoUrl(),
                time: this.syncData.player.getCurrentTime()
            };
            this.syncData.socket.emit(Event.SYNC_VIDEO_INFORMATION, videoInfo, socketId);
        });

        this.socket.on(Event.SYNC_VIDEO_INFORMATION, (videoInfo:VideoInfoInterface) =>
        {
            // TODO add buffer time (IDK how!!)
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
            this.syncData.player.seekTo(time, true);
        }
    }
}
