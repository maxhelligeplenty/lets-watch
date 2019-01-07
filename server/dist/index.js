"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var video_sync_server_1 = require("./video-sync-server");
var app = new video_sync_server_1.VideoSyncServer().getApp();
exports.app = app;
