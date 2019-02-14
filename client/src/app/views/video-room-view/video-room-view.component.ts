import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    Router
} from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
    selector:    'video-room-view',
    templateUrl: './video-room-view.component.html'
})
export class VideoRoomViewComponent implements OnInit
{
    public room:string = '';

    constructor(private route:ActivatedRoute)
    {
    }

    public ngOnInit():void
    {
        let snapshot:ActivatedRouteSnapshot = this.route.snapshot;
        if(!isNullOrUndefined(snapshot.paramMap.get('id')))
        {
            this.room = snapshot.paramMap.get('id');
        }
    }
}

