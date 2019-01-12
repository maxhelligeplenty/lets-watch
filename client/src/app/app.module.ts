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
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { DatenschutzViewComponent } from './views/datenschutz-view/datenschutz-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieLawModule } from 'angular2-cookie-law';

@NgModule({
    declarations: [
        AppComponent,
        VideoRoomViewComponent,
        StartPageViewComponent,
        VideoRoomComponent,
        StartPageComponent,
        DatenschutzViewComponent,
        DatenschutzComponent
    ],
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        CookieLawModule,
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
