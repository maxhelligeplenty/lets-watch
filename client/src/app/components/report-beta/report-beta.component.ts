import * as socketIo from 'socket.io-client';
import { Event } from './../../interface/event.interface';
import { Component, OnInit } from '@angular/core';
@Component
({
    selector:    'report-beta',
    templateUrl: './report-beta.component.html',
    styleUrls:   ['./report-beta.component.scss']
})

export class ReportBetaComponent implements OnInit
{
    private socket;

    public sendMailToServer()
    {
        this.socket.emit(Event.SEND_MAIL);
    }

    public ngOnInit():void
    {
        this.socket = socketIo('localhost:1337');
    }
}