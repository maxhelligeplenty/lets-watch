import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { VideoRoomComponent } from './components/video-room/video-room.component';
import { StartPageComponent } from './components/startpage/start-page.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { VideoRoomViewComponent } from './views/video-room-view/video-room-view.component';
import { StartPageViewComponent } from './views/start-page-view/start-page-view.component';

@NgModule({
    declarations: [
        AppComponent,
        VideoRoomViewComponent,
        StartPageViewComponent,
        VideoRoomComponent,
        StartPageComponent
    ],
    imports:      [
        BrowserModule,
        FormsModule,
        YoutubePlayerModule,
        RouterModule.forRoot(
            routes
        ),
    ],
    providers:    [],
    bootstrap:    [AppComponent]
})
export class AppModule
{
}
