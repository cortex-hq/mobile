import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // configure Auth0
  // details for languageDictionary entries here: https://github.com/auth0/lock/blob/master/src/i18n/en.js
  lock = new Auth0Lock('Y9Jud1zCPhHie8pjQdBI2sQumJWG9f3d', 'cortex.eu.auth0.com', {
    theme: {
      primaryColor: '#31324F'
    },
    languageDictionary: {
      title: 'CORTEX',
      signUpTerms: 'vous acceptez les conditions d\'utilisation de Cortex'
    },
    mustAcceptTerms: true
  });

  constructor() {
    const _this = this;
    this.lock.on('authenticated', (authResult) => {
      // console.log('authenticated');
      // console.log(authResult);
      localStorage.setItem('id_token', authResult.idToken);

      _this.lock.getUserInfo(authResult.accessToken, (err, profile) => {
        localStorage.setItem('userName', JSON.stringify(profile));
      });

    });
  }

  public login() {
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    [ 'id_token', 'userName'].forEach(k => localStorage.removeItem(k));
  }

  public getUserName() {
    const userProfile = JSON.parse(localStorage.getItem('userName'));
    return `${userProfile.name}`;
  }

  public getProfilePicture() {
    const userProfile = JSON.parse(localStorage.getItem('userName'));
    return `${userProfile.picture}`;
  }
}
