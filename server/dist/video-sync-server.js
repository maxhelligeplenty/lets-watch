"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var event_interface_1 = require("./model/event.interface");
var VideoSyncServer = /** @class */ (function () {
    function VideoSyncServer() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    VideoSyncServer.prototype.createApp = function () {
        this.app = express();
    };
    VideoSyncServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    VideoSyncServer.prototype.config = function () {
        this.port = process.env.PORT || VideoSyncServer.PORT;
    };
    VideoSyncServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    VideoSyncServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on(event_interface_1.Event.CONNECT, function (socket) {
            socket.on('message', function (m) {
                _this.io.emit('message', m);
            });
            socket.on(event_interface_1.Event.DISCONNECT, function () {
                console.log('Client disconnected');
            });
            socket.on(event_interface_1.Event.PLAY, function () {
                _this.io.emit(event_interface_1.Event.PLAY);
            });
            socket.on(event_interface_1.Event.PAUSE, function () {
                _this.io.emit(event_interface_1.Event.PAUSE);
            });
            socket.on(event_interface_1.Event.SYNC_TIME, function (t) {
                console.log(t);
                _this.io.emit(event_interface_1.Event.SYNC_TIME, t);
            });
            socket.on(event_interface_1.Event.NEW_VIDEO, function (i) {
                console.log(i);
                _this.io.emit(event_interface_1.Event.NEW_VIDEO, i);
            });
            socket.on(event_interface_1.Event.ASK_VIDEO_INFORMATION, function () {
                socket.broadcast.emit(event_interface_1.Event.ASK_VIDEO_INFORMATION);
            });
            socket.on(event_interface_1.Event.SYNC_VIDEO_INFORMATION, function (v) {
                console.log(v);
                _this.io.emit(event_interface_1.Event.SYNC_VIDEO_INFORMATION, v);
            });
        });
    };
    VideoSyncServer.prototype.getApp = function () {
        return this.app;
    };
    VideoSyncServer.PORT = 8080;
    return VideoSyncServer;
}());
exports.VideoSyncServer = VideoSyncServer;
