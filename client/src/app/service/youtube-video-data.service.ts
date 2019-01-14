import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

const apiKey = 'AIzaSyAFK1fv9hExPRj8Io9nXaVRoHkwzRo0VwM';

@Injectable()
export class YoutubeVideoDataService
{
    private headers:HttpHeaders;

    constructor(private http:HttpClient)
    {
        this.headers = new HttpHeaders();
    }

    public getVideoInfoById(videoId:string):Observable<any>
    {
        let url:string = 'https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=' + videoId + '&key=' + apiKey;
        return this.http.get(
            url,
            {
                headers: this.headers
            }
        )
    }
}
