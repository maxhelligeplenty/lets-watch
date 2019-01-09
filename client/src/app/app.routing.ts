import { Routes } from '@angular/router';
import { StartPageViewComponent } from './views/start-page-view/start-page-view.component';
import { VideoRoomViewComponent } from './views/video-room-view/video-room-view.component';

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
    }
];