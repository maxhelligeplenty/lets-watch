import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component
({
    selector:    'footer',
    templateUrl: './footer.component.html',
    styleUrls:   ['./footer.component.scss']
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