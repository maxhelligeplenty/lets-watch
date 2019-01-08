"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socketIo = require("socket.io");
var express = require("express");
var action_interface_1 = require("./model/action.interface");
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
        this.io.on(action_interface_1.Action.DISCONNECT, function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.emit('message', m);
            });
            socket.on(action_interface_1.Action.DISCONNECT, function () {
                console.log('Client disconnected');
            });
            socket.on(action_interface_1.Action.STATE, function (s) {
                socket.broadcast.emit(action_interface_1.Action.STATE, s);
            });
            socket.on(action_interface_1.Action.SYNC_TIME, function (t) {
                socket.broadcast.emit(action_interface_1.Action.SYNC_TIME, t);
            });
            socket.on(action_interface_1.Action.NEW_VIDEO, function (id) {
                _this.io.emit(action_interface_1.Action.NEW_VIDEO, id);
            });
            socket.on(action_interface_1.Action.ASK_VIDEO_INFORMATION, function () {
                socket.broadcast.emit(action_interface_1.Action.ASK_VIDEO_INFORMATION);
            });
            socket.on(action_interface_1.Action.ASK_TIME, function () {
                socket.broadcast.emit(action_interface_1.Action.ASK_TIME);
            });
            socket.on(action_interface_1.Action.SYNC_VIDEO_INFORMATION, function (v) {
                _this.io.emit(action_interface_1.Action.SYNC_VIDEO_INFORMATION, v);
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
