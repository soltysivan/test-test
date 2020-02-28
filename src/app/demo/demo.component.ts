import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, LoginOpt, SocialUser } from 'angularx-social-login';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacebookUserProfile } from './FacebookUserProfile';
import { CustomFacebookLoginProvider } from '../providers/custom-facebook-login-provider';

declare let FB: any;

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

  getCookies = function(){
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
      var pair = pairs[i].split("=");
      cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
  };

  getStatus() {
    let myCookies = this.getCookies();
    alert(JSON.stringify(myCookies));
    let fbLoginOptions: LoginOpt = {
      scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
      return_scopes: true,
      enable_profile_selector: true
    };
    //this.deleteCookie('fblo_175067990580834');
    FB.getLoginStatus((response: any) => {
      if (response.status === 'connected') {
        let authResponse = response.authResponse;
        FB.api(`/me?fields=name,email,last_name,first_name,picture`, (fbUser: any) => {
          let user: SocialUser = new SocialUser();

          user.id = fbUser.id;
          user.name = fbUser.name;
          user.email = fbUser.email;
          user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
          user.firstName = fbUser.first_name;
          user.lastName = fbUser.last_name;
          user.authToken = authResponse.accessToken;

          user.facebook = fbUser;

          alert(JSON.stringify(user));
        });
      } else {
        alert(JSON.stringify(response));
      }
    });
  }

  facebookNative(){
    let fbLoginOptions: LoginOpt = {
      scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
      return_scopes: true,
      enable_profile_selector: true
    };
    FB.getLoginStatus((response: any) => {
      if (response.status === 'connected') {
        let authResponse = response.authResponse;
        FB.api(`/me?fields=name,email,last_name,first_name,picture`, (fbUser: any) => {
          let user: SocialUser = new SocialUser();

          user.id = fbUser.id;
          user.name = fbUser.name;
          user.email = fbUser.email;
          user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
          user.firstName = fbUser.first_name;
          user.lastName = fbUser.last_name;
          user.authToken = authResponse.accessToken;

          user.facebook = fbUser;

          alert(JSON.stringify(user));
        });
      } else {
        alert(JSON.stringify(response));
      }
    });


    FB.login((response: any) => {
      alert(JSON.stringify(response));
      if (response.authResponse) {
        let authResponse = response.authResponse;
        FB.api(`/me?fields=name,email,last_name,first_name,picture`, (fbUser: any) => {
          let user: SocialUser = new SocialUser();

          user.id = fbUser.id;
          user.name = fbUser.name;
          user.email = fbUser.email;
          user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
          user.firstName = fbUser.first_name;
          user.lastName = fbUser.last_name;
          user.authToken = authResponse.accessToken;

          user.facebook = fbUser;

          alert(JSON.stringify(user));
        });
      } else {
        alert(JSON.stringify(response));
      }
    }, fbLoginOptions);
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
