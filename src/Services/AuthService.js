import { UserManager, WebStorageStateStore } from 'oidc-client';
import { globalConfig } from '../configuration/config';

export default class AuthService {
  constructor() {
    const settings = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: globalConfig.config.auth.authority,
      client_id: globalConfig.config.auth.client_id,
      response_type: globalConfig.config.auth.response_type,
      scope: globalConfig.config.auth.scope,

      automaticSilentRenew: globalConfig.config.auth.automaticSilentRenew,
      redirect_uri: globalConfig.config.auth.redirect_uri,
      silent_redirect_uri: globalConfig.config.auth.silent_redirect_uri,
      post_logout_redirect_uri: globalConfig.config.auth.post_logout_redirect_uri,
    };
    this.state = {
      userManager: new UserManager(settings),
    };
  }

  async getUser() {
    return this.state.userManager.getUser();
  }

  login() {
    return this.state.userManager.signinRedirect();
  }

  postlogin() {
    return this.state.userManager.signinRedirectCallback();
  }

  renewToken() {
    return this.state.userManager.signinSilent();
  }

  postrenewToken() {
    return this.state.userManager.signinSilentCallback();
  }

  logout() {
    return this.state.userManager.signoutRedirect();
  }

  postLogout() {
    return this.state.userManager.signoutRedirectCallback();
  }

  removeUser() {
    return this.state.userManager.removeUser();
  }
}
