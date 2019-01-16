import {
    Component,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector:    'start',
    templateUrl: './start-page.component.html',
    styleUrls:   ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit
{
    constructor(private router:Router)
    {
    }

    public ngOnInit():void
    {
    }

    public joinRoom():void
    {
        this.router.navigate(['/room',this.getRandomRoomId()]);
    }

    private getRandomRoomId():string
    {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
