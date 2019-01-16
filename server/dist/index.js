"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mail_server_1 = require("./mail/mail-server");
var video_sync_server_1 = require("./video-sync-server");
var app = new video_sync_server_1.VideoSyncServer().getApp();
exports.app = app;
var mailServer = new mail_server_1.MailServer().getApp();
exports.mailServer = mailServer;
