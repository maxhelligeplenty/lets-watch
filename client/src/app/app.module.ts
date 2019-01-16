import { FooterComponent } from './components/footer/footer.component';
import { ReportBetaComponent } from './components/report-beta/report-beta.component';
import { BetaReportViewComponent } from './views/beta-report-view/beta-report-view.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieLawModule } from 'angular2-cookie-law';
import { HttpClientModule } from '@angular/common/http';
import { YoutubeVideoDataService } from './service/youtube-video-data.service';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { PrivacyViewComponent } from './views/privacy-view/privacy-view.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { ImpressumViewComponent } from './views/impressum-view/impressum-view.component';

@NgModule({
    declarations: [
        AppComponent,
        VideoRoomViewComponent,
        StartPageViewComponent,
        VideoRoomComponent,
        StartPageComponent,
        PrivacyViewComponent,
        PrivacyComponent,
        BetaReportViewComponent,
        ReportBetaComponent,
        FooterComponent,
        ImpressumComponent,
        ImpressumViewComponent
    ],
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CookieLawModule,
        FormsModule,
        YoutubePlayerModule,
        RouterModule.forRoot(
            routes
        ),
    ],
    providers:    [YoutubeVideoDataService],
    bootstrap:    [AppComponent]
})
export class AppModule
{
}
