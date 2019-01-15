import { BetaReportViewComponent } from './views/beta-report-view/beta-report-view.component';
import { Routes } from '@angular/router';
import { StartPageViewComponent } from './views/start-page-view/start-page-view.component';
import { VideoRoomViewComponent } from './views/video-room-view/video-room-view.component';
import { PrivacyViewComponent } from './views/privacy-view/privacy-view.component';

export const routes:Routes = [
    {
        path:       '',
        redirectTo: 'start',
        pathMatch:  'full'
    },
    {
        path:      'start',
        component: StartPageViewComponent,
    },
    {
        path:      'room/:id',
        component: VideoRoomViewComponent,
    },
    {
        path:      'datenschutz',
        component: PrivacyViewComponent
    },
    {
        path:      'beta',
        component: BetaReportViewComponent
    }
];