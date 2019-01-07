import { VideoSyncServer } from './video-sync-server';

let app = new VideoSyncServer().getApp();
export { app };