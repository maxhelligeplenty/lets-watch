"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var event_interface_1 = require("../model/event.interface");
var MailServer = /** @class */ (function () {
    function MailServer() {
        this.PORT = 1337;
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    MailServer.prototype.createApp = function () {
        this.mailServer = express();
    };
    MailServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.mailServer);
    };
    MailServer.prototype.config = function () {
        this.port = process.env.PORT || this.PORT;
    };
    MailServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    MailServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running mail server on port %s', _this.port);
        });
        this.io.on(event_interface_1.Event.CONNECT, function (socket) {
            socket.on(event_interface_1.Event.SEND_MAIL, function () {
                console.log('mail send');
            });
        });
    };
    MailServer.prototype.getApp = function () {
        return this.mailServer;
    };
    return MailServer;
}());
exports.MailServer = MailServer;
