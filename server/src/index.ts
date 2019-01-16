import { MailServer } from './mail/mail-server';
import { VideoSyncServer } from './video-sync-server';

let app = new VideoSyncServer().getApp();
let mailServer = new MailServer().getApp();
export { app, mailServer };