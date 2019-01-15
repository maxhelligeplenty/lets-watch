import { Router } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component
({
    selector:    'footer',
    templateUrl: './footer.component.html',
    styleUrls:   ['./footer.component.scss'],
    animations: [
        
    ]
})

export class FooterComponent
{
    constructor(private router:Router)
    {
        
    }

    public navigateToBeta():void
    {
        this.router.navigate(['/beta']);
    }

    public navigateToDatenschutz():void
    {
        this.router.navigate(['/datenschutz']);
    }
    
}