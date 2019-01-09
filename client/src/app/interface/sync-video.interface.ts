import * as socketIo from 'socket.io-client';

export interface SyncVideoInterface
{
    videoId:string;
    socket:socketIo;
    player:YT.Player;
    room:string;
    clientId?:string;
}