export enum Event
{
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    SYNC_TIME = 'sync-time',
    NEW_VIDEO = 'new-video',
    ASK_VIDEO_INFORMATION = 'ask-video-info',
    SYNC_VIDEO_INFORMATION = 'sync-video-info',
    STATE = 'state',
    PLAY = 'play',
    PAUSE = 'pause',
    JOIN = 'join',
    SEND_MESSAGE = 'send-message',
    PLAY_NEW_VIDEO = 'play-new-video',
    SEND_MAIL = 'send-mail',
    SYNC_CURRENT_ROOM_MEMBER = 'sync-current-room-member',
    ALERT_MEMBERS_NEW_USER = 'alert_members_new_user'
}