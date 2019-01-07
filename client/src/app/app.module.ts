import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { SocketService } from './service/socket.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports:      [
        BrowserModule,
        FormsModule,
        YoutubePlayerModule
    ],
    providers:    [SocketService],
    bootstrap:    [AppComponent]
})
export class AppModule
{
}
