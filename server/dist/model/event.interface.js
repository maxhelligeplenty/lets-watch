"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event;
(function (Event) {
    Event["CONNECT"] = "connect";
    Event["DISCONNECT"] = "disconnect";
    Event["SYNC_TIME"] = "sync-time";
    Event["NEW_VIDEO"] = "new-video";
    Event["ASK_VIDEO_INFORMATION"] = "ask-video-info";
    Event["SYNC_VIDEO_INFORMATION"] = "sync-video-info";
    Event["STATE"] = "state";
    Event["PLAY"] = "play";
    Event["PAUSE"] = "pause";
})(Event = exports.Event || (exports.Event = {}));