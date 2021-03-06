import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { FacebookUserProfile } from "./FacebookUserProfile";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  public user: SocialUser;
  public facebookUserProfile: FacebookUserProfile;
  public userProfile: any;
  private loggedIn: boolean;
  private facebookPath = 'https://graph.facebook.com/v3.1/me';

  constructor(public authService: AuthService,
              private http: HttpClient) {
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then( user => {
        console.log(user);
      })
      .catch(err => alert(JSON.stringify(err)));
  }

  signOut(): void {
    this.authService.signOut();
    this.facebookUserProfile = null;
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn){
        this.getUserData(user.authToken);
      }
    });
  }

  getUserData(accessToken){
    this.getData(accessToken).subscribe( user => {
      this.facebookUserProfile = user;
    }, error => alert(JSON.stringify(error)));
  }


  getData(accessToken: string): Observable<any> {
    const params = new HttpParams()
      .set('access_token', accessToken)
      .set('fields', 'name,email,last_name,first_name,picture');

    return this.http.get<Observable<any>>(`${this.facebookPath}`, {params});
  }

  getProfileUser(){
    this.getProfile(this.user.authToken).subscribe( userProfile => {
      this.userProfile = userProfile;
    })
  }

  getProfile(accessToken: string): Observable<any> {
    const params = new HttpParams()
      .set('access_token', accessToken);

    return this.http.get<Observable<any>>(`/profile`, {params});
  }

}
