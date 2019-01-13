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
            var room = '';
            var username = '';
            socket.on(event_interface_1.Event.JOIN, function (r, c) {
                socket.join(r);
                room = r;
                username = c;
                _this.io.to(room).emit(event_interface_1.Event.SEND_MESSAGE, {
                    content: username + ' connected'
                });
            });
            socket.on(event_interface_1.Event.SEND_MESSAGE, function (m) {
                _this.io.to(room).emit(event_interface_1.Event.SEND_MESSAGE, m);
            });
            socket.on(event_interface_1.Event.DISCONNECT, function () {
                _this.io.to(room).emit(event_interface_1.Event.SEND_MESSAGE, {
                    content: username + ' disconnected'
                });
            });
            socket.on(event_interface_1.Event.PLAY, function () {
                socket.to(room).emit(event_interface_1.Event.PLAY);
            });
            socket.on(event_interface_1.Event.PAUSE, function () {
                socket.to(room).emit(event_interface_1.Event.PAUSE);
            });
            socket.on(event_interface_1.Event.SYNC_TIME, function (t) {
                socket.to(room).emit(event_interface_1.Event.SYNC_TIME, t);
            });
            socket.on(event_interface_1.Event.NEW_VIDEO, function (i) {
                _this.io.to(room).emit(event_interface_1.Event.NEW_VIDEO, i);
            });
            // TODO emit to HOST user so just one client send info
            socket.on(event_interface_1.Event.ASK_VIDEO_INFORMATION, function (socketId) {
                _this.io.to(room).emit(event_interface_1.Event.ASK_VIDEO_INFORMATION, socketId);
            });
            socket.on(event_interface_1.Event.SYNC_VIDEO_INFORMATION, function (v, socketId) {
                socket.broadcast.to(socketId).emit(event_interface_1.Event.SYNC_VIDEO_INFORMATION, v);
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
