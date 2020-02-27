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
  private loggedIn: boolean;
  private facebookPath = 'https://graph.facebook.com/v3.1/me';

  constructor(public authService: AuthService,
              private http: HttpClient) {
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
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
    })
  }


  getData(accessToken: string): Observable<any> {
    const params = new HttpParams()
      .set('access_token', accessToken)
      .set('fields', 'name,email,last_name,first_name,picture');

    return this.http.get<Observable<any>>(`${this.facebookPath}`, {params});
  }

}
