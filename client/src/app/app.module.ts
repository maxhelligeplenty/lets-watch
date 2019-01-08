import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { YoutubePlayerModule } from 'ngx-youtube-player';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports:      [
        BrowserModule,
        FormsModule,
        YoutubePlayerModule
    ],
    providers:    [],
    bootstrap:    [AppComponent]
})
export class AppModule
{
}
