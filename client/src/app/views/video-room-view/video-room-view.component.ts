import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot } from '../../../../node_modules/@angular/router/src';
import { isNullOrUndefined } from 'util';

@Component({
    selector:    'video-room-view',
    templateUrl: './video-room-view.component.html'
})
export class VideoRoomViewComponent implements OnInit
{
    protected room:string = '';

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

